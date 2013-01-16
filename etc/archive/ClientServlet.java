package com.mxgraph.online;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.logging.Logger;
import java.util.regex.Pattern;
import java.util.zip.CRC32;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheException;
import net.sf.jsr107cache.CacheManager;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.apphosting.api.DeadlineExceededException;

/**
 * Servlet implementation class OpenServlet
 * 
 * TODOs
 * -----
 * 
 * - Add validation of incoming version numbers. 
 * 
 */
public class ClientServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	/**
	 * Connection constants
	 */
	private final static String JGRAPH_EVAL_REMOTE = "http://mxclient.jgraph.com/demo/mxgraph/src/js/mxclient.php?header=0&version=";
	private final static int CONNECTION_TIMEOUT = 10 * 1000;
	private final static int READ_TIMEOUT = 10 * 1000;
	
	private final static Logger LOGGER = Logger.getLogger(ClientServlet.class.getName());

	
	private final static StringBuilder MESSAGE_HEADER = new StringBuilder(
			"// YOU ARE NOT PERMITED TO EXTRACT THE SOURCE OF THIS APPLICATION FOR EXECUTION LOCALLY.\n// YOUR IP ADDRESS HAS BEEN LOGGED, ABUSES WILL CAUSE ACCESS TO THE JGRAPH SERVER TO BE BLOCKED.\n");
	// IE date format for If-Modified-Since and Last-Modified
	private final static SimpleDateFormat IE = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss z");
	private final static SimpleDateFormat MESSAGE_HEADER_DATE_FORMAT = new SimpleDateFormat("d MMM yyyy HH:mm:ss");
	private final static String ALERT_RESPONSE_REGEX = ".*alert\\(\\\".*\"\\);.*";
	
	private final static int SCRIPT_BUFFER_SIZE = 1048576;

	/**
	 * Data Store Entity constants
	 * */
	private final static String ENTITY_KEY_KIND = "mxGraphScript";
	private final static String ENTITY_SCRIPT = "script";
	private final static String ENTITY_DATE_MODIFIED = "dateModified";
	
	private final static String CACHE_KEY = "5ecba5bd1d4a23e36cddf80c151df716";

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ClientServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String stringMessage = null;
		String version = request.getParameter("version");
		Object[] dateScriptPair = null;

		String internalAgentCode = getInternalUserAgent(request);

		if (internalAgentCode == null) {
			// Need to send us a sensible user agent
			LOGGER.warning("Invalid user agent.");
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}

		String cacheCode = "mx-" + internalAgentCode + "-" + version;
		
		if(isClearCache(request)) {
			try {
				clearCache();
				clearDataStore(cacheCode);
				LOGGER.info("Cache cleared.");
			} catch (Exception e) {
				LOGGER.severe("Error clearing cache : " + e.toString());
			}
		}
			
		if (version == null) {
			// Need to send us a version
			LOGGER.warning("No version requested.");
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}

		try {
			dateScriptPair = getData(cacheCode);
		} catch (DeadlineExceededException e) {
			LOGGER.severe("Request is taking too long to complete. Remote IP : " + request.getRemoteAddr() + ", internal agent code : " + internalAgentCode + ", script version : " + version + ". Original exception : " + e.getMessage());
		}


		try {
			// if it's not found in server cache, get the script from the server, stamp it and cache it
			if (dateScriptPair == null) {
				LOGGER.info("Script not found in cache.");
				// Create a URL for the desired page
				URL url = new URL(JGRAPH_EVAL_REMOTE + version);

				stringMessage = getScript(url, request);
				
				if(checkResponseStringForAlert(stringMessage)) {
					LOGGER.info("Response contained a JavaScript alert : " + stringMessage);
					sendResponse(response, stringMessage);
					return;
				}

				if (!checkScript(stringMessage)) {
					LOGGER.severe("CRC check failed!");
				}

				Date dateModified = new Date();
				dateScriptPair = new Object[2];
				dateScriptPair[0] = dateModified.getTime() / 1000 * 1000;// have to round the date to conform to IE....
				dateScriptPair[1] = stringMessage;
				response.addHeader("Last-Modified", dateScriptPair[0].toString());
				
				storeData(cacheCode, dateScriptPair);

			} else { // found it in cache, check the stamp in browser's cache and send "304 Not Modified" if it's cached on the client side
				LOGGER.info("Script found in cache.");

				response.addHeader("Last-Modified", dateScriptPair[0].toString());

				if (isSend304(request, response, dateScriptPair)) {
					LOGGER.info("304 Not Modified");
					response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
					return;
				}

			}
		} catch (Throwable e) {
			LOGGER.warning(e.toString());
		}

		LOGGER.info("Sending script.");
		sendResponse(response, formatMessage(request, (Long) dateScriptPair[0], (String) dateScriptPair[1]));

	}
	
	private boolean isClearCache(HttpServletRequest request) {
		String cc = request.getParameter("clearcache");
		return cc != null && cc.equals(CACHE_KEY);
	}
	
	private void clearCache() {
		Cache cache = null;
		try {
			cache = CacheManager.getInstance().getCacheFactory().createCache(Collections.emptyMap());
		} catch (CacheException e) {
			LOGGER.warning(e.toString());
		}
		
		if(cache != null) {
			cache.clear();
		}
	}
	
	private void clearDataStore(String key) {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query(ENTITY_KEY_KIND);
		PreparedQuery pq = datastore.prepare(q);
		
		ArrayList<Key> keys = new ArrayList<Key>();
		
		for(Entity e : pq.asIterable()) {
			keys.add(e.getKey());
		}
		
		datastore.delete(keys);
	}

	private Object[] getData(String key) {

		Object[] data = null;

		data = getDataFromCache(key);

		if (data == null) {
			data = getDataFromDataStore(key);
			
			//found in data store but not in memcache so cache it
			if(data != null) {
				storeDataInCache(key, data);
			}
		}//found in memcache but not in data store so store it
		else if(getDataFromDataStore(key) == null) {
			storeDataInDataStore(key, data);
		}

		return data;
	}

	private Object[] getDataFromCache(String key) {
		Object[] data = null;
		Cache cache = null;
		try {
			cache = CacheManager.getInstance().getCacheFactory().createCache(Collections.emptyMap());
		} catch (CacheException e) {
			LOGGER.warning(e.toString());
		}

		if (cache != null) {
			data = (Object[]) cache.get(key);
		}

		return data;
	}
	
	private void storeDataInCache(String key, Object [] data) {
		
		Cache cache = null;
		try {
			cache = CacheManager.getInstance().getCacheFactory().createCache(Collections.emptyMap());
		} catch (CacheException e) {
			LOGGER.warning(e.toString());
		}
		
		if (cache != null) {
			cache.put(key, data);
		}
		
	}
	
	private void storeData(String key, Object [] data) {
		storeDataInCache(key, data);
		storeDataInDataStore(key, data);
	}
	
	private void storeDataInDataStore(String key, Object [] data) {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		Entity entity = new Entity(ENTITY_KEY_KIND, key);
		entity.setProperty(ENTITY_DATE_MODIFIED, data[0]);
		entity.setProperty(ENTITY_SCRIPT, new Text((String)data[1]));
		
		datastore.put(entity);
	}

	private Object[] getDataFromDataStore(String key) {
		Object[] data = null;
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

		if (data == null) {
			Key cacheKey = KeyFactory.createKey(ENTITY_KEY_KIND, key);
			try {
				Entity entity = datastore.get(cacheKey);
				Text text = (Text) entity.getProperty(ENTITY_SCRIPT);
				Long dateModified = (Long) entity.getProperty(ENTITY_DATE_MODIFIED);
				data = new Object[2];
				data[0] = dateModified.longValue();
				data[1] = text.getValue();

			} catch (EntityNotFoundException e) {
				
			}

		}

		return data;
	}

	private String formatMessage(HttpServletRequest request, Long creationDate, String script) {
		StringBuilder sb = new StringBuilder(MESSAGE_HEADER);
		sb.append("// File created " + MESSAGE_HEADER_DATE_FORMAT.format(creationDate) + " for " + request.getHeader("user-agent") + " IP "
				+ request.getRemoteAddr() + "\n");
		sb.append(script);
		return sb.toString();

	}

	private boolean isSend304(HttpServletRequest request, HttpServletResponse response, Object[] dateScriptPair) {
		String ifMod = request.getHeader("If-Modified-Since");
		// if the stamps on the server and client match, no need to send the whole script again, just use the one in browser cache
		if (ifMod != null && !ifMod.equals("")) {
			Long ifModified = parseIfModified(ifMod);

			Long lastModified = (Long) dateScriptPair[0];
			return ifModified >= lastModified;
		}

		return false;
	}

	/**
	 * Zips and sends the script
	 * 
	 * @param response
	 * @param data
	 */
	private void sendResponse(HttpServletResponse response, String data) {
		response.setContentType("application/x-javascript");
		response.addHeader("Cache-Control", "private");
		response.setStatus(HttpServletResponse.SC_OK);
		OutputStream out = null;

		try {
			out = response.getOutputStream();
			out.write(data.getBytes());
		} catch (Throwable e) {
			LOGGER.warning(e.toString());
		} finally {
			try {
				if (out != null) {
					out.close();
				}
			} catch (IOException e) {
			}
		}
	}

	private boolean checkScript(String string) throws IOException {

		if (string == null) {
			return false;
		}

		BufferedReader reader = new BufferedReader(new StringReader(string));
		String crcLine = reader.readLine();
		reader.readLine();
		String script = reader.readLine();
		return checkCrc(Long.parseLong(crcLine.split("=")[1]), script);
	}

	private boolean checkCrc(Long remoteCrc, String javascript) {
		CRC32 crc = new CRC32();
		crc.update(javascript.getBytes());

		return remoteCrc == crc.getValue();
	}

	/**
	 * Reads the script from the specified URL
	 * 
	 * @param url URL to read the script from
	 * @param request request specifying the user agent
	 * @return
	 */
	private String getScript(URL url, HttpServletRequest request) {
		StringBuilder mxclient = new StringBuilder();
		BufferedInputStream in = null;

		try {
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setConnectTimeout(CONNECTION_TIMEOUT);
			conn.setReadTimeout(READ_TIMEOUT);
			conn.setRequestMethod("GET");
			conn.setRequestProperty("User-Agent", request.getHeader("user-agent"));
			conn.connect();

			byte[] byteBuffer = new byte[SCRIPT_BUFFER_SIZE];
			in = new BufferedInputStream(conn.getInputStream());

			in.read(byteBuffer);
			mxclient.append(new String(byteBuffer, Charset.forName("UTF-8")).trim());
		} catch (Throwable e) {
			LOGGER.severe(e.toString());
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
				}
			}
		}

		return mxclient.toString();
	}

	/**
	 * Parses the If-Modified String which can either be long or date(IE).
	 * 
	 * @param ifModStr input string
	 * @return long
	 */
	private Long parseIfModified(String ifModStr) {

		try {
			Long ifModLong = Long.parseLong(ifModStr);
			return ifModLong;
		} catch (Exception e) {
		}

		try {
			Date ifModDate = IE.parse(ifModStr);
			return ifModDate.getTime();
		} catch (ParseException e) {
			LOGGER.warning(e.toString());
		}

		return null;
	}

	private String getInternalUserAgent(HttpServletRequest request) {

		String userAgent = request.getHeader("user-agent").toUpperCase();

		boolean isIe = userAgent.contains("MSIE");
		boolean isIe6 = userAgent.contains("MSIE 6");
		boolean isNs = userAgent.contains("MOZILLA/") && !isIe;
		boolean isOp = userAgent.contains("OPERA/");
		boolean isGc = userAgent.contains("CHROME/");
		boolean isSf = userAgent.contains("APPLEWEBKIT/") && !isGc;
		boolean isMt = (userAgent.contains("FIREFOX/") && !userAgent.contains("FIREFOX/1") && !userAgent.contains("FIREFOX/2"))
				|| (userAgent.contains("ICEWEASEL/")) && !(userAgent.contains("ICEWEASEL/1")) && !(userAgent.contains("ICEWEASEL/2"))
				|| (userAgent.contains("SEAMONKEY/")) && !(userAgent.contains("SEAMONKEY/1"))
				|| (userAgent.contains("ICEAPE/") && !(userAgent.contains("ICEAPE/1")));

		if (isIe6) {
			return "ie6";
		} else if (isIe) {
			return "ie";
		} else if (isGc) {
			return "gc";
		} else if (isSf) {
			return "sf";
		} else if (isOp) {
			return "op";
		} else if (isMt) {
			return "mt";
		} else if (isNs) {
			return "ns";
		}

		return null;
	}
	
	private boolean checkResponseStringForAlert(String responseString) {
		return  Pattern.matches(ALERT_RESPONSE_REGEX, responseString);
	}
}
