/*
 * Set of variables and method specific to the Google Drive integration 
 */
var mxGoogleDrive =
{
	appID : '420247213240',
	clientID : '420247213240-hnbju1pt13seqrc1hhd5htpotk4g9q7u.apps.googleusercontent.com',
	apiKey : 'AIzaSyCtCIW1vJ21MAk8hZsuCtzov-0d01VS8Qc',
	scopes : [ 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.install',
			'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile' ],
	accessToken : null,
	integrationButton : null,
	isOperationInProgress : false,
	editorUi : null,
	openAction : null,
	retryLimit : 5,
	timeoutId : null,
	timeoutLength : 7000,
	tryCount : 0,
	response : null,
	cookieRegex : /\s?drive=.*/,
	authMethod :
	//stores the auth method and parameters in case it is automatically repeated
	{
		method : null,
		args : []
	},
	fileInfo :
	{
		'id' : null,
		'title' : 'untitled.html',
		'content' : '',
		'mimeType' : 'application/mxe',
		'description' : '',
		'parents' : []
	},
	checkAuthorization : function(immediate, userId)
	{
		//mxLog.show();
		mxGoogleDrive.authMethod.method = mxGoogleDrive.checkAuthorization;
		mxGoogleDrive.authMethod.args = [ immediate, userId ];

		var immed = typeof immediate == 'boolean' ? immediate : false;

		gapi.auth.authorize(
		{
			client_id : mxGoogleDrive.clientID,
			scope : mxGoogleDrive.scopes.join(' '),
			user_id : userId,
			immediate : immed
		}, mxGoogleDrive.handleAuth);
	},
	connectClick : function()
	{
		//mxLog.show();
		mxGoogleDrive.authMethod.method = mxGoogleDrive.connectClick;
		mxGoogleDrive.authMethod.args = arguments;

		var stateObj = mxGoogleDrive.getStateObject();
		var userId = stateObj != null ? stateObj.userId : null;
		if (urlParams['fileId'] != null)
		{
			userId = mxIntegration.userId;
		}

		var config =
		{
			client_id : mxGoogleDrive.clientID,
			scope : mxGoogleDrive.scopes.join(' ')
		}

		if (userId != null)
		{
			config.user_id = userId
		} else
		{
			config.authuser = -1;
		}

		gapi.auth.authorize(config, mxGoogleDrive.handleAuth);
	},
	handleLoginRepeatAttempt : function(authFunction, args)
	{
		if (mxGoogleDrive.tryCount < mxGoogleDrive.retryLimit)
		{
			mxGoogleDrive.tryCount += 1;
			mxIntegration.setMessage(mxResources.get('retryingLogin'));
			mxLog.debug('handleLoginRepeatAttempt ' + mxGoogleDrive.tryCount);
			authFunction(args);
		} else
		{
			mxGoogleDrive.tryCount = 0;
			mxGoogleDrive.showIntegrationButton(true);
			mxIntegration.showUserControls(false);
			mxUtils.alert(mxResources.get('cannotLogin'));
		}
	},

	loadDriveApi : function(callback)
	{
		mxLog.debug('loadDriveApi');
		gapi.client.load('drive', 'v2', callback);
	},
	loadOauth2Api : function(callback)
	{
		mxLog.debug('loadOauth2Api');
		gapi.client.load('oauth2', 'v2', callback);
	},
	handleAuth : function(auth)
	{
		mxLog.debug('handleAuth');
		mxGoogleDrive.timeoutId = setTimeout(function()
		{
			mxGoogleDrive.handleLoginRepeatAttempt(mxGoogleDrive.authMethod.method, mxGoogleDrive.authMethod.args);
		}, mxGoogleDrive.timeoutLength);

		mxIntegration.setActiveIntegration(mxGoogleDrive);
		if (auth == null)
		{
			mxGoogleDrive.accessToken = null;

			//if token is revoked and cookie is present do not proceed with auth flow as it will trigger the popup that will get blocked by browser
			if (mxGoogleDrive.getCookie() != null)
			{
				mxIntegration.clearCookies();
			}
		} else
		{
			mxIntegration.setIntegrationProgress(25);
			mxGoogleDrive.showIntegrationButton(false);
			mxIntegration.showUserControls(true);
			mxGoogleDrive.accessToken = auth.access_token;
			mxGoogleDrive.loadOauth2Api(mxGoogleDrive.handleOauth2ApiLoad);
		}
	},
	handleOauth2ApiLoad : function(res)
	{
		mxLog.debug('handleOauth2ApiLoad');
		mxIntegration.setIntegrationProgress(50);
		mxGoogleDrive.loadDriveApi(function(res)
		{
			mxIntegration.setIntegrationProgress(75);
			mxGoogleDrive.getUserInfo(mxGoogleDrive.accessToken, function(res)
			{
				mxLog.debug('getUserInfo response');
				var responseText = res.getText ? res.getText() : res.responseText;
				var userInfo = JSON.parse(responseText);
				mxIntegration.setUsername(userInfo.email);

				mxIntegration.setUserId(userInfo.id);
				mxIntegration.loggedOut = false;
				mxIntegration.setCookie('drive', Base64.encode(userInfo.id), 365);// cookie expires after 365 days
				mxIntegration.setIntegrationProgress(100);
				mxIntegration.setLoggedIn(true);
				clearTimeout(mxGoogleDrive.timeoutId);
				mxGoogleDrive.tryCount = 0;

				mxGoogleDrive.postIntegration();

			}, function(err)
			{
				var responseText = res.getText ? res.getText() : res.responseText;
				var errorInfo = JSON.parse(responseText);
			});

		});
	},
	getUserInfo : function(accessToken, onSuccess, onFailure)
	{
		mxLog.debug('getUserInfo');
		var endPointURL = 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + accessToken;
		this.sendHttpRequest(endPointURL, onSuccess, onFailure);
	},
	sendHttpRequest : function(url, onSuccess, onFailure)
	{
		if (navigator.userAgent.indexOf('MSIE 9') != -1)
		{
			var xdr = new XDomainRequest();

			xdr.onload = function()
			{
				onSuccess(xdr);
			};
			xdr.onerror = function()
			{
				onFailure(xdr);
			};
			xdr.open('get', url);
			xdr.send();

		} else
		{
			mxUtils.get(url, onSuccess, onFailure, true);
		}
	},

	isDriveReady : function()
	{
		return gapi.client.drive != null;
	},

	createIntegrationButton : function()
	{
		var driveImg = document.createElement('img');
		driveImg.src = '/images/google-drive-20x20.png';
		driveImg.style.padding = '0px 5px 0px 10px';
		driveImg.style.border = 'none';
		driveImg.style.verticalAlign = 'middle';
		var text = document.createElement('span');
		text.innerHTML = mxResources.get('connectWithDrive');
		text.style.verticalAlign = 'middle';

		this.integrationButton = document.createElement('div');

		this.integrationButton.appendChild(text);
		this.integrationButton.appendChild(driveImg);

		this.integrationButton.className = 'geItem';

		mxEvent.addListener(this.integrationButton, 'click', mxGoogleDrive.connectClick);

		return this.integrationButton;
	},
	showIntegrationButton : function(show)
	{
		this.integrationButton.style.display = show ? 'inline' : 'none';
	},
	startIntegration : function()
	{
		var state = urlParams['state'];
		var userID = null;

		if (state != null)
		{
			var stateObj = JSON.parse(decodeURIComponent(state));
			userID = stateObj.userId;
		}

		if (userID == null)
		{
			userID = this.getUserIDFromCookie(this.getCookie());
		}

		this.checkAuthorization(true, userID);

	},
	saveOrUpdateFile : function(fileId, parents, fileName, content, tryCount)
	{
		if (typeof tryCount === "undefined")
		{
			tryCount = 0;

			if (this.timeoutId != null)//if user initiated the save again, stop the expo backoff save 
			{
				clearTimeout(this.timeoutId);
				this.timeoutId = null;
			}
		}

		if (this.isOperationInProgress)
		{
			return;
		}

		var boundary = '-------314159265358979323846';
		var delimiter = "\r\n--" + boundary + "\r\n";
		var close_delim = "\r\n--" + boundary + "--";

		var contentType = 'application/octect-stream';
		var metadata =
		{
			'title' : fileName,
			'mimeType' : 'application/mxe'
		};

		if (parents != null)
		{
			metadata.parents = parents;
		}

		var base64Data = Base64.encode(content);
		var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delimiter
				+ 'Content-Type: ' + contentType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n' + '\r\n' + base64Data + close_delim;

		var request = gapi.client.request(
		{
			'path' : '/upload/drive/v2/files' + (fileId != null ? '/' + fileId : ''),
			'method' : fileId != null ? 'PUT' : 'POST',
			'params' :
			{
				'uploadType' : 'multipart'
			},
			'headers' :
			{
				'Content-Type' : 'multipart/mixed; boundary="' + boundary + '"'
			},
			'body' : multipartRequestBody
		});

		mxIntegration.spinner = mxIntegration.createSpinner(this.editorUi.editor.graph.container);
		this.isOperationInProgress = true;

		var callback = function(resp)
		{
			if (resp.error == null && resp)
			{
				mxGoogleDrive.fileInfo = resp;
				mxGoogleDrive.editorUi.editor.filename = name;
				mxGoogleDrive.editorUi.editor.modified = false;
				mxIntegration.spinner.stop();
				mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('saved'));
			} else
			{
				mxIntegration.spinner.stop();

				if (tryCount < mxGoogleDrive.retryLimit)
				{
					var retryInterval = Math.pow(2, tryCount) * 1000;

					mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('errorSavingFile') + '. ' + mxResources.get('retryingIn', [retryInterval / 1000]));
					mxGoogleDrive.timeoutId = setTimeout(function()
					{
						mxGoogleDrive.saveOrUpdateFile(fileId, parents, fileName, content, tryCount + 1);
					}, retryInterval);
				} else
				{
					mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('errorSavingFile'));
					mxUtils.alert(mxResources.get('errorSavingFile'));
				}
			}

			mxGoogleDrive.isOperationInProgress = false;
		};

		request.execute(callback);
	},
	loadFileMetaData : function(fileId)
	{
		mxLog.debug('loadFileMetaData');
		mxIntegration.spinner = mxIntegration.createSpinner(this.editorUi.editor.graph.container);
		
		var handleFileMetaDataLoad = function(resp)
		{
			mxLog.debug('loadFileMetaData resp : ' + resp);
			if (resp.error == null)
			{
				mxGoogleDrive.fileInfo = resp;
				mxGoogleDrive.loadFileContents(resp.downloadUrl + '&access_token=' + mxGoogleDrive.accessToken);
			} else
			{
				mxLog.debug('loadFileMetaData error, try count  : ' + mxGoogleDrive.tryCount);
				mxGoogleDrive.response = resp;
				mxGoogleDrive.handleFileLoadError(resp);
			}
		};

		var request = gapi.client.drive.files.get(
		{
			'fileId' : fileId
		});

		var args = arguments;
		mxGoogleDrive.timeoutId = setTimeout(function()
		{
			if (mxGoogleDrive.tryCount < mxGoogleDrive.retryLimit)
			{
				mxLog.debug('loading timeout, try count  : ' + mxGoogleDrive.tryCount);
				mxGoogleDrive.tryCount += 1;
				mxGoogleDrive.loadFileMetaData(args);
			} else
			{
				mxGoogleDrive.tryCount = 0;
				var msg = mxResources.get('errorLoadingFile');

				if(mxGoogleDrive.response != null) 
				{
					if(mxGoogleDrive.response.code == 404) 
					{
						msg = mxResources.get('fileNotFound'); 
					}
				} 
				
				mxGoogleDrive.editorUi.editor.setStatus(msg);
				mxUtils.alert(msg);
			}
		}, mxGoogleDrive.timeoutLength);

		request.execute(handleFileMetaDataLoad);
	},
	loadFileContents : function(downloadUrl)
	{
		var onLoad = function(res)
		{
			clearTimeout(mxGoogleDrive.timeoutId);

			var responseText = res.getText ? res.getText() : res.responseText;
			var doc = mxUtils.parseXml(responseText);

			mxGoogleDrive.editorUi.editor.setGraphXml(doc.documentElement);
			mxGoogleDrive.editorUi.editor.modified = false;
			mxGoogleDrive.editorUi.editor.undoManager.clear();
			mxGoogleDrive.editorUi.editor.filename = mxGoogleDrive.fileInfo.title;
			mxGoogleDrive.editorUi.editor.setStatus('');
			mxGoogleDrive.editorUi.editor.graph.container.focus();

			mxIntegration.spinner.stop();
			mxGoogleDrive.tryCount = 0;
		};
		var onError = function(resp)
		{
			mxLog.debug('loadFileContents error, try count  : ' + mxGoogleDrive.tryCount);
			mxGoogleDrive.handleFileLoadError(res);
		};

		this.sendHttpRequest(downloadUrl, onLoad, onError);
	},
	handleFileLoadError : function(resp)
	{
		mxIntegration.spinner.stop();
		mxLog.debug('handleFileLoadError response : ' + resp);
		mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('retryingLoad'));

	},
	postIntegration : function()
	{
		this.openAction = this.editorUi.actions.get('open');
		var editorUi = this.editorUi;
		this.editorUi.actions.addAction('open', mxUtils.bind(this, function()
		{
			if (typeof (google) != 'undefined' && typeof (google.picker) != 'undefined')
			{
				var view = new google.picker.View(google.picker.ViewId.DOCS);
				view.setMimeTypes('application/mxe');

				new google.picker.PickerBuilder().addView(view).setAppId(mxGoogleDrive.appID).setAuthUser(mxIntegration.userId)
						.enableFeature(google.picker.Feature.NAV_HIDDEN).enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
						.setCallback(function(data)
						{
							if (data.action == google.picker.Action.PICKED)
							{
								var dialog = new FilePickerDialog(editorUi, data.docs);
								editorUi.showDialog(dialog.container, 320, 50, true, true);
							}
						}).build().setVisible(true);
			} else
			{
				window.open('https://drive.google.com');
			}
		}));

		//only load file if the current diagram's changes have been saved
		if (!mxGoogleDrive.editorUi.editor.modified)
		{
			//open the file if there's a fileId parameter present in the URL
			var fileId = urlParams['fileId'];
			var state = urlParams['state'];

			if (state != null)
			{
				try
				{
					var tmp = JSON.parse(decodeURIComponent(state));
					if (tmp.ids != null && tmp.ids.length > 0)
					{
						fileId = tmp.ids[0];
					} else if (tmp.parentId != null)
					{
						mxGoogleDrive.fileInfo.parents = [
						{
							'kind' : 'drive#fileLink',
							'id' : tmp.parentId
						} ];
					}
				} catch (e)
				{
					// Invalid state ignored
				}
			}
			if (fileId != null)
			{
				this.loadFileMetaData(fileId);
			}
		}
	},
	disconnect : function()
	{
		this.editorUi.actions.put('open', this.openAction);
	},
	getCookie : function()
	{
		var cookies = document.cookie.split(";");
		for ( var i = 0; i < cookies.length; i++)
		{
			var cookie = cookies[i];
			if (cookie.match(this.cookieRegex) != null)
			{
				return cookie;
			}
		}

		return null;
	},
	getUserIDFromCookie : function(cookie)
	{
		if (cookie != null)
		{
			var parts = cookie.split("=");
			var val = decodeURIComponent(parts[1]);
			return Base64.decode(val);
		}

		return null;
	},
	getStateObject : function()
	{
		var state = urlParams['state'];
		var stateObj = null;

		if (state != null)
		{
			var stateObj = JSON.parse(decodeURIComponent(state));
		}

		return stateObj;
	}
}