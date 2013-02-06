/*
 * Set of variables and method specific to the Google Drive integration 
 */
var mxGoogleDrive =
{
	// Use these settings for testdrawio.appspot.com
	/*appID : '163632362748',
	clientID : '163632362748-upgu5tdab5bjgntq3qmvo9dvhqfeu1hm.apps.googleusercontent.com',
	apiKey : 'AIzaSyCEqguTW7a75lGDc9EzRNIGB2pg-UYBfDc',
	scopes : [ 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.install',
		'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile' ],*/
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
	loadTimeout : null,//how long to wait before declaring an ongoing load attempt a failure
	loadRetryTimeout : null,//how long to wait before initiating a new load attempt
	tryCount : 0,
	response : null,
	cookieName : 'drive',
	cookieRegex : /\s?drive=.*/,
	saveArgs : null,//arguments used when retrying save after token expiration recovery
	authConfig : null ,//auth args are stored in case auth is automatically repeated
	fileInfo :
	{
		'id' : null,
		'title' : 'untitled.html',
		'content' : '',
		'mimeType' : 'application/mxe',
		'description' : '',
		'parents' : []
	},
	stateMachine : null,
	checkAuthorization : function(authConfig)
	{
		//mxLog.show();
		mxGoogleDrive.authConfig = authConfig;
		gapi.auth.authorize(authConfig, mxGoogleDrive.handleAuth);
	},
	connectClick : function()
	{
		var stateObj = mxGoogleDrive.getStateObject();
		var userId = stateObj != null ? stateObj.userId : null;
		if (urlParams['fileId'] != null)
		{
			userId = mxIntegration.userId;
		}

		var config = mxGoogleDrive.createAuthConfig(userId, false);		
		mxGoogleDrive.startIntegration(config);//disconnected -> authorizing
	},
	handleLoginRepeatAttempt : function(authConfig)
	{
		if (mxGoogleDrive.tryCount < mxGoogleDrive.retryLimit)
		{
			mxGoogleDrive.tryCount += 1;
			mxIntegration.setMessage(mxResources.get('retryingLogin'));
			mxLog.debug('handleLoginRepeatAttempt ' + mxGoogleDrive.tryCount);
			mxGoogleDrive.checkAuthorization.apply(mxGoogleDrive,authConfig);
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
			mxGoogleDrive.stateMachine.timeout();
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
				mxIntegration.setCookie(mxGoogleDrive.cookieName, Base64.encode(mxIntegration.userId), 365);// cookie expires after 365 days
				mxIntegration.setIntegrationProgress(100);
				mxIntegration.setLoggedIn(true);
				clearTimeout(mxGoogleDrive.timeoutId);
				mxGoogleDrive.tryCount = 0;
				mxGoogleDrive.stateMachine.ok();
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
		driveImg.src = 'images/google-drive-20x20.png';
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
	startIntegration : function(authConfig)
	{
		mxGoogleDrive.stateMachine = new Stately(mxGoogleDrive.machineStatesObject);
		mxGoogleDrive.stateMachine.bind(function notification(event, oldState, newState)
		{
			mxLog.debug(oldState, ' -> ' , newState, event != null ? 'on ' + event : '');
		});

		mxGoogleDrive.stateMachine.connect(authConfig);
	},
	saveOrUpdateFile : function(fileId, parents, fileName, content, tryCount, stateObject)
	{
		stateObject.setMachineState(stateObject.saving);
		mxGoogleDrive.saveArgs = arguments;

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
				mxGoogleDrive.editorUi.editor.modified = false;
				mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('saved') + ' ' + new Date());
				
				mxGoogleDrive.stateMachine.ok();//saving -> ready
				if(mxGoogleDrive.getFileID() == null || mxGoogleDrive.getFileID() != resp.id)//do we need to redirect to match the ID of the working file to fileID in URL?
				{
					window.location.replace(mxGoogleDrive.editorUi.getUrl(window.location.pathname + '?fileId=' + resp.id));
				}
			} else if (resp.error.code == 401)
			{
				mxGoogleDrive.stateMachine.unauthorized(mxGoogleDrive.saveArgs);
			} else if (resp.error.code == 403 && resp.error.errors[0].reason == "userAccess")
			{
				mxGoogleDrive.stateMachine.retryOnError(null, parents, fileName, content, tryCount);//if we're denied access to the opened file, save a new copy
			} else if (resp.error.code == 404) 
			{
				mxGoogleDrive.stateMachine.giveUpOnError(resp.error.code);
			}
			else
			{
				if (tryCount < mxGoogleDrive.retryLimit)
				{
					mxGoogleDrive.stateMachine.retryOnError(fileId, parents, fileName, content, tryCount);
					
				} else
				{
					mxGoogleDrive.stateMachine.giveUpOnError();
				}
			}
			mxIntegration.spinner.stop();
			mxGoogleDrive.isOperationInProgress = false;
		};

		request.execute(callback);
	},
	loadFileMetaData : function(fileId, stateObject)
	{
		mxLog.debug('loadFileMetaData');
		
		if (mxIntegration.spinner == null)
		{
			mxIntegration.spinner = mxIntegration.createSpinner(this.editorUi.editor.graph.container);
			mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('loading') + '...');
		} else 
		{
			mxIntegration.spinner.spin(this.editorUi.editor.graph.container);
		}
		

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
		mxGoogleDrive.loadTimeout = setTimeout(function()
		{
			if (mxGoogleDrive.tryCount < mxGoogleDrive.retryLimit)
			{
				clearTimeout(mxGoogleDrive.loadTimeout);
				mxGoogleDrive.stateMachine.retryOnError(fileId, stateObject);
			} else
			{
				mxGoogleDrive.stateMachine.giveUpOnError();
			}
		}, mxGoogleDrive.timeoutLength);

		request.execute(handleFileMetaDataLoad);
	},
	loadFileContents : function(downloadUrl)
	{
		var onLoad = function(res)
		{
			if(res.request.status == 200) 
			{
				clearTimeout(mxGoogleDrive.loadTimeout);
				
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
				mxGoogleDrive.stateMachine.ok();//loading -> ready
			}
			else 
			{
				mxGoogleDrive.handleFileLoadError(res);
			}
			
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
		//mxIntegration.spinner.stop();
		//clearTimeout(mxGoogleDrive.loadTimeout);
		//mxLog.debug('handleFileLoadError response : ' + resp);
		//mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('retryingLoad'));

	},
	postAuthorization : function(stateObject)
	{
		stateObject.setMachineState(stateObject.postAuth);//authorizing -> post-auth

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
		mxGoogleDrive.stateMachine.ok();

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
				mxGoogleDrive.stateMachine.load(fileId);
			}
		}

	},
	disconnect : function()
	{
		mxGoogleDrive.stateMachine.disconnect();
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
	},
	createAuthConfig : function(userID, immediate) 
	{
		var obj = 
		{
			client_id : mxGoogleDrive.clientID,
			scope : mxGoogleDrive.scopes.join(' '),
			immediate : immediate
		};
		
		if(userID == null) 
		{
			obj.authuser = -1;
		} else 
		{
			obj.user_id = userID;
		}
		
		return obj;
		
	},
	getFileID : function() 
	{
		var fileID = null;
		var stateObj = this.getStateObject();
		
		if(stateObj != null && stateObj.ids != null && stateObj.ids.length > 0) 
		{
			fileID = stateObj.ids[0];
		} else if(urlParams['fileId'] != null) 
		{
			fileID = urlParams['fileId'];
		}
		
		return fileID;
	},
	machineStatesObject :
	{
		'disconnected' :
		{
			connect : function(authConfig)
			{
				if(authConfig == null) 
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
						userID = mxGoogleDrive.getUserIDFromCookie(mxGoogleDrive.getCookie());
					}
					
					authConfig = mxGoogleDrive.createAuthConfig(userID, true);
					mxGoogleDrive.checkAuthorization(authConfig);
				}
				else 
				{
					mxGoogleDrive.checkAuthorization(authConfig);
				}
				return this.authorizing;
			}
		},
		'authorizing' :
		{
			ok : function()
			{
				mxGoogleDrive.postAuthorization(this);
			},
			timeout : function()
			{
				mxGoogleDrive.handleLoginRepeatAttempt(mxGoogleDrive.authConfig);
			}
		},
		'postAuth' :
		{
			ok : function()
			{
				return this.ready;
			}
		},
		'ready' :
		{
			save : function(fileId, parents, name, xml)
			{
				mxGoogleDrive.saveOrUpdateFile(fileId, parents, name, xml,0, this);
			},
			load : function(fileId)
			{
				mxGoogleDrive.loadFileMetaData(fileId, this);
				return this.loading;
			},
			disconnect : function() 
			{
				mxGoogleDrive.editorUi.actions.put('open', mxGoogleDrive.openAction);
				mxIntegration.setLoggedIn(false);
				mxIntegration.showUserControls(false);
				mxGoogleDrive.editorUi.showDialog(new LogoutPopup(mxGoogleDrive.editorUi).container, 320, 80, true, true);

				return this.disconnected;
			}
		},
		'saving' :
		{
			ok : function()
			{
				return this.ready;
			},
			unauthorized : function(args) 
			{
				var stateObject = this;
				var dialog = new SessionTimeoutDialog(mxGoogleDrive.editorUi);

				dialog.buttons.appendChild(mxUtils.button(mxResources.get('ok'), function()
				{
					mxIntegration.setLoggedIn(false);
					stateObject.setMachineState(stateObject.reauthorizing);
					//mxGoogleDrive.authConfig.immediate = false;// force 'immediate' to false in case of 401
					var authConfig = mxGoogleDrive.createAuthConfig(mxIntegration.userId, false);
					mxGoogleDrive.checkAuthorization.apply(mxGoogleDrive, [authConfig]);
					mxGoogleDrive.editorUi.hideDialog();
				}));

				dialog.buttons.appendChild(mxUtils.button(mxResources.get('cancel'), function()
				{
					mxIntegration.setLoggedIn(false);
					mxIntegration.showUserControls(false);
					mxGoogleDrive.editorUi.hideDialog();
				}));

				mxGoogleDrive.editorUi.showDialog(dialog.container, 370, 70, true, true);
			},
			retryOnError : function(fileId, parents, fileName, content, tryCount) 
			{
				var stateObject = this;
				var retryInterval = Math.pow(2, tryCount) * 1000 + Math.random() * 1000;

				mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('errorSavingFile') + '. '
						+ mxResources.get('retryingIn', [ retryInterval / 1000 ]));
				mxGoogleDrive.timeoutId = setTimeout(function()
				{
					mxGoogleDrive.saveOrUpdateFile(fileId, parents, fileName, content, tryCount + 1, stateObject);
				}, retryInterval);
			},
			giveUpOnError : function(errorCode) 
			{
				if(errorCode == null) 
				{
					mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('errorSavingFile'));
					mxUtils.alert(mxResources.get('errorSavingFile'));
				} else if(errorCode == 403) 
				{
					mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('errorSavingFileForbidden'));
					mxUtils.alert(mxResources.get('errorSavingFileForbidden'));
				} else if(errorCode == 404) 
				{
					mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('errorSavingFileNotFound'));
					mxUtils.alert(mxResources.get('errorSavingFileNotFound'));
				}

				return this.ready;
			}
		},
		'reauthorizing' : 
		{
			ok : function() 
			{
				mxGoogleDrive.saveOrUpdateFile.apply(mxGoogleDrive, mxGoogleDrive.saveArgs);
			}
		},
		'loading' :
		{
			ok : function()
			{
				return this.ready;
			},
			retryOnError : function(fileId, stateObject)
			{
				mxLog.debug('loading timeout, try count  : ' + mxGoogleDrive.tryCount);
				mxIntegration.spinner.stop();

				var retryInterval = Math.pow(2, mxGoogleDrive.tryCount++) * 1000 + Math.random() * 1000;

				mxGoogleDrive.editorUi.editor.setStatus(mxResources.get('errorLoadingFile') + '. '
						+ mxResources.get('retryingIn', [ retryInterval / 1000 ]));
				mxLog.debug('Before : ', new Date(), 'interval : ' + retryInterval);
				mxGoogleDrive.loadRetryTimeout = setTimeout(function()
				{
					mxLog.debug('After : ', new Date());
					mxGoogleDrive.loadFileMetaData.apply(mxGoogleDrive, [fileId, stateObject]);
				}, retryInterval);
				
			},
			giveUpOnError : function()
			{
				mxGoogleDrive.tryCount = 0;
				mxIntegration.spinner.stop();
				var msg = mxResources.get('errorLoadingFile');

				if (mxGoogleDrive.response != null)
				{
					if (mxGoogleDrive.response.error.code == 404)
					{
						msg = mxResources.get('fileNotFound');
					}
				}

				mxGoogleDrive.editorUi.editor.setStatus(msg);
				mxUtils.alert(msg);
				return this.ready;
			}
		}
	}
}