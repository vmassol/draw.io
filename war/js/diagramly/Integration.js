var mxIntegration =
{
	userId : null,
	usernameEl : null,
	logoutEl : null,
	activeIntegration : null,// Google Drive or Dropbox or something else
	shouldLogout : false,
	loggedOut : true,
	userControlsEl : null,
	spinner : null,

	createUi : function()
	{
		this.userControlsEl = document.createElement('div');
		this.userControlsEl.style.padding = '4px 12px 5px 10px';
		this.userControlsEl.style.cssFloat = 'right';
		this.userControlsEl.style.styleFloat = 'right';
		this.userControlsEl.style.display = 'none';

		this.usernameEl = document.createElement('span');
		this.usernameEl.style.cssFloat = 'left';
		this.usernameEl.style.styleFloat = 'left';
		this.usernameEl.style.padding = '0px 8px 5px 10px';
		this.usernameEl.style.fontStyle = 'italic';
		this.usernameEl.style.display = 'none';

		this.logoutEl = document.createElement('div');
		this.logoutEl.className = 'geItem';
		this.logoutEl.style.cssFloat = 'left';
		this.logoutEl.style.styleFloat = 'left';
		this.logoutEl.style.padding = '0px 12px 5px 10px';
		this.logoutEl.style.display = 'none';
		this.logoutEl.innerHTML = mxResources.get('signOut', 'Sign Out');

		mxEvent.addListener(this.logoutEl, 'click', function(evt)
		{
			mxIntegration.clearCookies();
			mxIntegration.activeIntegration.disconnect();
		});

		var clearDiv = document.createElement('div');
		clearDiv.style.clear = 'both';
		
		this.progressIndicator = document.createElement('div');
		this.progressIndicator.style.display = 'none';

		this.userControlsEl.appendChild(this.progressIndicator);
		this.userControlsEl.appendChild(this.usernameEl);
		this.userControlsEl.appendChild(this.logoutEl);
		this.userControlsEl.appendChild(clearDiv);

		return this.userControlsEl;
	},
	setUsername : function(username)
	{
		this.usernameEl.innerHTML = username;
	},
	getUsername : function()
	{
		return this.usernameEl != null ? this.usernameEl.innerHTML : '';
	},
	setUserId : function(userId)
	{
		this.userId = userId;
	},
	setActiveIntegration : function(integration)
	{
		this.activeIntegration = integration;
	},
	getActiveIntegration : function()
	{
		return activeIntegration;
	},
	showLogoutLink : function(show)
	{
		this.logoutEl.style.display = show ? 'inline' : 'none';
	},
	showUsername : function(show)
	{
		this.usernameEl.style.display = show ? 'inline' : 'none';
	},
	initiateLogout : function()
	{
		this.shouldLogout = true;
	},
	setCookie : function(c_name, value, exdays)
	{
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
		document.cookie = c_name + "=" + c_value;
	},
	clearCookies : function()
	{
		var cookies = document.cookie.split(";");
		for ( var i = 0; i < cookies.length; i++)
		{
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	},
	getIntegrationFromCookie : function()
	{
		var drive = mxGoogleDrive.getCookie();
		
		if(drive != null) 
		{
			return mxGoogleDrive;
		}

		return null;
	},
	startIntegration : function()
	{
		var integration = this.getIntegrationFromCookie();
		if(urlParams['state'] != null) 
		{
			integration = mxGoogleDrive;
		}
		if (integration == null)
		{
			return;
		}
		
		integration.startIntegration();
	},
	createSpinner : function(container)
	{
		var opts =
		{
			lines : 12, // The number of lines to draw
			length : 12, // The length of each line
			width : 5, // The line thickness
			radius : 10, // The radius of the inner circle
			rotate : 0, // The rotation offset
			color : '#000', // #rgb or #rrggbb
			speed : 1, // Rounds per second
			trail : 60, // Afterglow percentage
			shadow : false, // Whether to render a shadow
			hwaccel : false, // Whether to use hardware acceleration
			className : 'spinner', // The CSS class to assign to the spinner
			zIndex : 2e9, // The z-index (defaults to 2000000000)
			left : container.scrollLeft + container.clientWidth / 2 - 12, // Left
			// position relative to parent in px 
			top : container.scrollTop + container.clientHeight / 2 - 12 // Top
		};

		return new Spinner(opts).spin(container);
	},
	showProgressIndicator : function(show) 
	{
		this.progressIndicator.style.display = show ? 'inline' : 'none';
	},
	setIntegrationProgress : function(pct) 
	{
		this.progressIndicator.innerHTML = mxResources.get('connecting', 'Connecting') + ' ' + pct + '%';
		this.showProgressIndicator(pct != 100);
	},
	setMessage : function(msg) 
	{
		this.progressIndicator.innerHTML = msg;
	},
	showUserControls : function(show) 
	{
		this.userControlsEl.style.display = show ? 'inline' : 'none';
	},
	setLoggedIn : function(loggedIn) 
	{
		this.showUsername(loggedIn);
		this.showLogoutLink(loggedIn);
		this.activeIntegration.showIntegrationButton(!loggedIn);
		
		this.loggedOut = !loggedIn;
		
	}

}

//adds the integration UI elements such as 'Integrate with <service-name>' and username and log out link
EditorUi.prototype.createIntegrationUi = function()
{
	var editorUi = this;

	var integrationsContainer = document.createElement('div');
	integrationsContainer.style.cssFloat = 'right';
	integrationsContainer.style.styleFloat = 'right';

	var intWithDriveBtn = mxGoogleDrive.createIntegrationButton();
	mxGoogleDrive.editorUi = this;//TODO maybe find a better place for this reference assignment? 

	integrationsContainer.appendChild(intWithDriveBtn);
	integrationsContainer.appendChild(mxIntegration.createUi());

	return integrationsContainer;
}

EditorUi.prototype.setUserInfo = function(email, userId)
{
	var editorUi = this;
	editorUi.userInfo = editorUi.userInfo || {};
	editorUi.userInfo.id = userId;
	editorUi.userInfo.email = email;
	editorUi.userInfo.loggedOut = false;

	editorUi.userInfo.emailEl.style.display = 'inline';
	editorUi.userInfo.logoutEl.style.display = 'inline';
	editorUi.userInfo.emailEl.innerHTML = email;
};
/*
 * Currently not used anywhere 
 */
EditorUi.prototype.checkSession = function()
{
	var integration = mxIntegration.activeIntegration;
	
	var cookieId = integration != null ? integration.getUserIDFromCookie(integration.getCookie()) : null;

	// if the cookies value has changed, notify the user about the end of the session
	if ((mxIntegration.userId != null && mxIntegration.userId != cookieId && !mxIntegration.loggedOut)
			|| (cookieId == null && !mxIntegration.loggedOut))
	{
		mxIntegration.setLoggedIn(false);
		mxIntegration.showUserControls(false);
		this.showDialog(new LogoutPopup(this).container, 320, 80, true, true);
	}
};

LogoutPopup = function(ui)
{
	var div = document.createElement('div');
	div.setAttribute('align', 'center');

	mxUtils.write(div, mxResources.get('userLoggedOut') + ' ' + mxIntegration.getUsername());
	mxUtils.br(div);
	mxUtils.br(div);

	div.appendChild(mxUtils.button(mxResources.get('close'), function()
	{
		ui.hideDialog();
	}));

	this.container = div;
}