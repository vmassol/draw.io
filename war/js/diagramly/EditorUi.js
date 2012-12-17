(function()
{
	// Fetches footer from page
	EditorUi.prototype.createFooter = function()
	{
		var footer = this.createDiv('geFooter');
		var contents = document.getElementById('geFooter');

		if (contents != null)
		{
			footer.appendChild(contents);
			contents.style.visibility = 'visible';
		}

		return footer;
	};

	// Overrides footer height
	EditorUi.prototype.footerHeight = 44;

	// Initializes the user interface
	var editorUiInit = EditorUi.prototype.init;
	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);
		var signs = this.sidebar.signs;
		var mockups = this.sidebar.mockups;
		var ee = this.sidebar.ee;
		var pids = this.sidebar.pids;

		// Adds style input in test mode
		if (urlParams['test'] == '1')
		{
			var footer = document.getElementById('geFooter');

			if (footer != null)
			{
				this.styleInput = document.createElement('input');
				this.styleInput.setAttribute('type', 'text');
				this.styleInput.style.position = 'absolute';
				this.styleInput.style.left = '2px';
				// Workaround for ignore right CSS property in FF
				this.styleInput.style.width = '98%';
				this.styleInput.style.visibility = 'hidden';

				mxEvent.addListener(this.styleInput, 'change', mxUtils.bind(this, function()
				{
					this.editor.graph.getModel().setStyle(this.editor.graph.getSelectionCell(), this.styleInput.value);
				}));

				footer.appendChild(this.styleInput);

				this.editor.graph.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt)
				{
					if (this.editor.graph.getSelectionCount() > 0)
					{
						var cell = this.editor.graph.getSelectionCell();
						var style = this.editor.graph.getModel().getStyle(cell);

						this.styleInput.value = style;
						this.styleInput.style.visibility = 'visible';
					} else
					{
						this.styleInput.style.visibility = 'hidden';
					}
				}));
			}

			var isSelectionAllowed = this.isSelectionAllowed;
			this.isSelectionAllowed = function(evt)
			{
				if (mxEvent.getSource(evt) == this.styleInput)
				{
					return true;
				}

				return isSelectionAllowed.apply(this, arguments);
			};
		}

		// Changes default extension for Google Drive
		this.editor.getOrCreateFilename = function()
		{
			return this.filename || mxResources.get('drawing', [ counter ]);
		};

		// Removes info text in page
		var info = document.getElementById('geInfo');

		if (info != null)
		{
			info.parentNode.removeChild(info);
		}

		// Hides libraries
		var stc = urlParams['libs'];

		// Default libraries for domains
		if (stc == null)
		{
			stc = 'general;images;uml;bpmn;flowchart;basic;arrows;clipart';
		}

		var tmp = stc.split(';');

		// Individual libs
		var all = [ 'general', 'images', 'uml', 'bpmn', 'flowchart', 'basic', 'arrows', 'leanMapping' ]

		for ( var i = 0; i < all.length; i++)
		{
			if (mxUtils.indexOf(tmp, all[i]) < 0)
			{
				this.sidebar.togglePalettes('', [ all[i] ]);
			}
		}

		if (mxUtils.indexOf(tmp, 'clipart') < 0)
		{
			this.sidebar.togglePalettes('', [ 'computer', 'finance', 'clipart', 'networking', 'people', 'telco' ]);
		}

		if (mxUtils.indexOf(tmp, 'mockups') < 0)
		{
			this.sidebar.togglePalettes('ui', mockups);
		}

		if (mxUtils.indexOf(tmp, 'signs') < 0)
		{
			this.sidebar.togglePalettes('signs', signs);
		}

		if (mxUtils.indexOf(tmp, 'electrical') < 0)
		{
			this.sidebar.togglePalettes('electrical', ee);
		}

		if (mxUtils.indexOf(tmp, 'aws') < 0)
		{
			this.sidebar.togglePalettes('aws', [ 'Compute', 'ContentDelivery', 'Database', 'DeploymentManagement', 'Groups', 'Messaging',
					'Misc', 'Networking', 'NonServiceSpecific', 'OnDemandWorkforce', 'Storage' ]);
		}

		if (mxUtils.indexOf(tmp, 'pid') < 0)
		{
			this.sidebar.togglePalettes('pid', pids);
		}

		// TODO: Expand the first entry

		// Adds zoom via shift-wheel
		mxEvent.addMouseWheelListener(mxUtils.bind(this, function(evt, up)
		{
			var outlineWheel = false;

			if (this.editor.outline.outline.dialect == mxConstants.DIALECT_SVG)
			{
				var source = mxEvent.getSource(evt);

				while (source != null)
				{
					if (source == this.editor.outline.outline.view.canvas.ownerSVGElement)
					{
						outlineWheel = true;
						break;
					}

					source = source.parentNode;
				}
			}

			if (mxEvent.isShiftDown(evt) || outlineWheel)
			{
				if (up)
				{
					this.editor.graph.zoomIn();
				} else
				{
					this.editor.graph.zoomOut();
				}

				mxEvent.consume(evt);
			}
		}));

		// Installs popup menu in Sidebar
		var menu = new mxPopupMenu(this.menus.get('moreShapes').funct);
		var ignoreEvent = false;

		mxEvent.addListener(this.sidebarContainer, 'mousedown', function(evt)
		{
			if (!ignoreEvent)
			{
				menu.hideMenu();
			}

			if (!mxEvent.isConsumed(evt) && mxEvent.isPopupTrigger(evt))
			{
				var origin = mxUtils.getScrollOrigin();
				var point = new mxPoint(mxEvent.getClientX(evt) + origin.x, mxEvent.getClientY(evt) + origin.y);

				// Menu is shifted by 1 pixel so that the mouse up event
				// is routed via the underlying shape instead of the DIV
				menu.popup(point.x + 1, point.y + 1, null, evt);
				mxEvent.consume(evt, false);
				ignoreEvent = true;
			}
		});

		mxEvent.addListener(this.sidebar.moreShapes, 'mousedown', function(evt)
		{
			menu.hideMenu();

			if (!mxEvent.isConsumed(evt))
			{
				var origin = mxUtils.getScrollOrigin();
				var point = new mxPoint(mxEvent.getClientX(evt) + origin.x, mxEvent.getClientY(evt) + origin.y);
				// Menu is shifted by 1 pixel so that the mouse up event
				// is routed via the underlying shape instead of the DIV
				menu.popup(point.x + 1, point.y + 1, null, evt);
				mxEvent.consume(evt, false);
				ignoreEvent = true;
			}
		});

		// NOTE: In quirks mode the event is not the same instance as above
		mxEvent.addListener(document.body, 'mousedown', function(evt)
		{
			if (!ignoreEvent)
			{
				menu.hideMenu();
			}

			ignoreEvent = false;
		});

		// Disables crisp rendering in SVG except for connectors, actors,
		// cylinder,
		// ellipses must be enabled after rendering the sidebar items
		if (urlParams['aa'] == '0')
		{
			mxShape.prototype.crisp = false;
			mxCellRenderer.prototype.defaultShapes['folder'].prototype.crisp = false;
		}

		// Initial page layout view, scrollBuffer and timer-based scrolling
		var graph = this.editor.graph;
		var pageBorder = 800;
		graph.timerAutoScroll = true;

		var graphSizeDidChange = graph.sizeDidChange;
		graph.sizeDidChange = function()
		{
			var bounds = this.getGraphBounds();

			if (this.container != null)
			{
				if (this.scrollbars && !touchStyle)
				{
					var border = this.getBorder();

					var t = this.view.translate;
					var s = this.view.scale;
					var width = Math.max(0, bounds.x + bounds.width + 1 + border - t.x * s);
					var height = Math.max(0, bounds.y + bounds.height + 1 + border - t.y * s);
					var fmt = this.pageFormat;
					var ps = this.pageScale;
					var page = new mxRectangle(0, 0, fmt.width * ps, fmt.height * ps);

					var hCount = (this.pageBreaksVisible) ? Math.max(1, Math.ceil(width / (page.width * s))) : 1;
					var vCount = (this.pageBreaksVisible) ? Math.max(1, Math.ceil(height / (page.height * s))) : 1;

					var gb = this.getGraphBounds();

					// Computes unscaled, untranslated graph bounds
					var x = (gb.width > 0) ? gb.x / this.view.scale - this.view.translate.x : 0;
					var y = (gb.height > 0) ? gb.y / this.view.scale - this.view.translate.y : 0;
					var w = gb.width / this.view.scale;
					var h = gb.height / this.view.scale;

					var fmt = this.pageFormat;
					var ps = this.pageScale;

					var pw = fmt.width * ps;
					var ph = fmt.height * ps;

					var x0 = Math.floor(Math.min(0, x) / pw);
					var y0 = Math.floor(Math.min(0, y) / ph);

					hCount -= x0;
					vCount -= y0;

					// Extends the page border based on current scale
					var pb = pageBorder;

					var minWidth = (pb * 2 + pw * hCount);
					var minHeight = (pb * 2 + ph * vCount);
					var m = graph.minimumGraphSize;
					
					if (m == null || m.width != minWidth || m.height != minHeight)
					{
						graph.minimumGraphSize = new mxRectangle(0, 0, minWidth, minHeight);
					}

					var autoDx = pb - x0 * fmt.width;
					var autoDy = pb - y0 * fmt.height;

					if (!this.autoTranslate && (graph.view.translate.x != autoDx || graph.view.translate.y != autoDy))
					{
						this.autoTranslate = true;

						// NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY
						// THERE IS NO WAY AROUND THIS SINCE THE BOUNDS ARE
						// KNOWN AFTER THE VALIDATION AND SETTING THE
						// TRANSLATE TRIGGERS A REVALIDATION. SHOULD
						// MOVE TRANSLATE/SCALE TO VIEW.
						var tx = graph.view.translate.x;
						var ty = graph.view.translate.y;

						graph.view.setTranslate(autoDx, autoDy);
						graph.container.scrollLeft += (autoDx - tx) * graph.view.scale;
						graph.container.scrollTop += (autoDy - ty) * graph.view.scale;

						this.autoTranslate = false;
						return;
					}
				} else
				{
					graph.minimumGraphSize = null;
				}

				graphSizeDidChange.apply(this, arguments);
			}
		};

		// LATER: Cleanup
		graph.getPreferredPageSize = function(bounds, width, height)
		{
			var border = this.getBorder();
			var t = this.view.translate;
			var s = this.view.scale;
			width = Math.max(0, bounds.x + bounds.width + 1 + border - t.x * s);
			height = Math.max(0, bounds.y + bounds.height + 1 + border - t.y * s);
			var fmt = this.pageFormat;
			var ps = this.pageScale;
			var page = new mxRectangle(0, 0, fmt.width * ps, fmt.height * ps);

			var hCount = (this.pageBreaksVisible) ? Math.max(1, Math.ceil(width / (page.width * s))) : 1;
			var vCount = (this.pageBreaksVisible) ? Math.max(1, Math.ceil(height / (page.height * s))) : 1;

			var gb = this.getGraphBounds();

			// Computes unscaled, untranslated graph bounds
			var x = (gb.width > 0) ? gb.x / this.view.scale - this.view.translate.x : 0;
			var y = (gb.height > 0) ? gb.y / this.view.scale - this.view.translate.y : 0;
			var w = gb.width / this.view.scale;
			var h = gb.height / this.view.scale;

			var fmt = this.pageFormat;
			var ps = this.pageScale;

			var pw = fmt.width * ps;
			var ph = fmt.height * ps;

			var x0 = Math.floor(Math.min(0, x) / pw);
			var y0 = Math.floor(Math.min(0, y) / ph);

			hCount -= x0;
			vCount -= y0;

			return new mxRectangle(0, 0, hCount * page.width + 2, vCount * page.height + 2);
		};

		// LATER: Zoom to multiple pages using minimumGraphSize
		var outlineGetSourceContainerSize = this.editor.outline.getSourceContainerSize;
		this.editor.outline.getSourceContainerSize = function()
		{
			if (graph.scrollbars && !touchStyle)
			{
				var scale = this.source.view.scale;
				
				return new mxRectangle(0, 0, this.source.container.scrollWidth - pageBorder * 2 * scale,
					this.source.container.scrollHeight - pageBorder * 2 * scale);
			}

			return outlineGetSourceContainerSize.apply(this, arguments);
		};

		this.editor.outline.getOutlineOffset = function(scale)
		{
			if (graph.scrollbars && !touchStyle)
			{
				var fmt = this.source.pageFormat;
				var ps = this.source.pageScale;

				var pw = fmt.width * ps;
				var ph = fmt.height * ps;

				var dx = this.outline.container.clientWidth / scale - pw;
				var dy = this.outline.container.clientHeight / scale - ph;

				return new mxPoint(dx / 2 - pageBorder, dy / 2 - pageBorder);
			}

			return null;
		};

		graph.sizeDidChange();

		// Sets the default edge
		var cells = [ new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none') ];
		cells[0].edge = true;

		// Uses edge template for connect preview
		graph.connectionHandler.createEdgeState = function(me)
		{
			return graph.view.createState(cells[0]);
		};

		// Creates new connections from edge template
		graph.connectionHandler.factoryMethod = function()
		{
			return graph.cloneCells([ cells[0] ])[0];
		};

		// Switch to page view by default
		this.actions.get('pageView').funct();

		var editorUi = this;
		var showIntegrationUi =  typeof driveIntegration == 'undefined' ? true : driveIntegration;
		if(navigator.userAgent.indexOf('MSIE 8') == -1 && navigator.userAgent.indexOf('MSIE 7') == -1 && !mxClient.IS_IE6 && navigator.userAgent.indexOf('MSIE 5') == -1 && showIntegrationUi ) 
		{
			editorUi.menubar.container.appendChild(this.createIntegrationUi());
		}

		/*setInterval(function()
		{
			editorUi.checkSession();
		}, 1000);*/
	};

	/**
	 * Returns the URL for a copy of this editor with no state.
	 */
	EditorUi.prototype.getUrl = function(pathname)
	{
		var href = (pathname != null) ? pathname : window.location.pathname;
		var parms = (href.indexOf('?') > 0) ? 1 : 0;

		// Removes template URL parameter for new blank diagram
		for (var key in urlParams)
		{
			if (key != 'tmp' && key != 'libs' && key != 'state' && key != 'fileId' && key != 'code' && key != 'share' && key != 'url')
			{
				if (parms == 0)
				{
					href += '?';
				}
				else
				{
					href += '&';
				}

				href += key + '=' + urlParams[key];
				parms++;
			}
		}

		return href;
	};

	// Spinner only loaded for Google Drive operations in Init
	function createSpinner(container)
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
			// position
			// relative
			// to
			// parent
			// in
			// px
			top : container.scrollTop + container.clientHeight / 2 - 12 // Top
		// position
		// relative
		// to
		// parent
		// in px
		};

		return new Spinner(opts).spin(container);
	}
	;

	// Loads the specified template
	var editorUiOpen = EditorUi.prototype.open;
	EditorUi.prototype.open = function()
	{
		// Cross-domain window access is not allowed in FF, so if we
		// were opened from another domain then this will fail.
		var openingFile = false;

		try
		{
			openingFile = !(window.opener == null || window.opener.openFile == null);
		} catch (e)
		{
			// ignore
		}

		if (!openingFile)
		{
			// Checks if we should connect to a shared diagram
			var documentName = urlParams['share'];
			var urlParam = urlParams['url'];

			if (documentName != null)
			{
				this.connect(documentName);
			} else if (urlParam != null)
			{
				// Loads diagram from the given URL
				var spinner = createSpinner(this.editor.graph.container);
				this.editor.setStatus(mxResources.get('loading') + '...');
				mxUtils.get('proxy?url=' + urlParam, mxUtils.bind(this, function(req)
				{
					spinner.stop();
					if (req.getStatus() != 200)
					{
						this.editor.setStatus(mxResources.get('fileNotLoaded'));
						mxUtils.alert(mxResources.get('fileNotLoaded'));
					} else
					{
						var text = req.getText();

						if (text != null && text.length > 0)
						{
							var doc = mxUtils.parseXml(text);
							this.editor.setGraphXml(doc.documentElement);

							// Restores initial diagram state
							this.editor.modified = false;
							this.editor.undoManager.clear();
							this.editor.filename = null;

							this.editor.setStatus('');
							this.editor.graph.container.focus();
						} else
						{
							this.editor.setStatus(mxResources.get('fileNotLoaded'));
							mxUtils.alert(mxResources.get('fileNotLoaded'));
						}
					}
				}), function()
				{
					spinner.stop();
					this.editor.setStatus(mxResources.get('errorLoadingFile'));
					mxUtils.alert(mxResources.get('errorLoadingFile'));
				});
			}

			// Opens the given template
			var template = urlParams['tmp'];

			if (template != null && template.length > 0)
			{
				mxUtils.get(TEMPLATE_PATH + '/xml/' + template + '.xml', mxUtils.bind(this, function(req)
				{
					this.editor.setGraphXml(req.getDocumentElement());

					// Restores initial diagram state
					this.editor.modified = false;
					this.editor.undoManager.clear();
				}));
			}
		} else
		{
			editorUiOpen.apply(this, arguments);
		}
	};

	EditorUi.prototype.save = function(name)
	{
		var editorUi = this;

		if (name == null)
		{
			return;
		}

		var xml = mxUtils.getXml(this.editor.getGraphXml());

		if (!mxIntegration.loggedOut && mxGoogleDrive.isDriveReady())
		{
			if (urlParams['state'] != null)
			{
				var tmp = JSON.parse(decodeURIComponent(urlParams['state']));
				if (tmp != null && tmp.folderId != null && tmp.folderId.length > 0)
				{
					mxGoogleDrive.fileInfo.parents = [
					{
						'kind' : 'drive#fileLink',
						'id' : tmp.folderId
					} ];
				}
			}

			mxGoogleDrive.saveOrUpdateFile(mxGoogleDrive.fileInfo.id, mxGoogleDrive.fileInfo.parents, name, xml);
		} else if (useLocalStorage)
		{
			if (localStorage.getItem(name) != null && !mxUtils.confirm(mxResources.get('replace', [ name ])))
			{
				return;
			}

			localStorage.setItem(name, xml);
			this.editor.setStatus(mxResources.get('saved'));

			this.editor.filename = name;
			this.editor.modified = false;
		} else
		{
			if (xml.length < MAX_REQUEST_SIZE)
			{
				xml = encodeURIComponent(xml);
				new mxXmlRequest(SAVE_URL, 'filename=' + name + '&xml=' + xml).simulate(document, "_blank");
			} else
			{
				mxUtils.alert(mxResources.get('drawingTooLarge'));
				mxUtils.popup(xml);

				return;
			}

			this.editor.filename = name;
			this.editor.modified = false;
		}

	}
	// Sharing
	EditorUi.prototype.connect = function(name, highlight)
	{
		if (this.sharing == null)
		{
			this.editor.setStatus(mxResources.get('connecting') + '...');

			try
			{
				sharejs
						.open(
								name,
								'json',
								SHARE_HOST + '/sjs',
								mxUtils
										.bind(
												this,
												function(error, doc, connection)
												{
													if (doc == null)
													{
														mxUtils.alert(error);
													} else
													{
														this.sharing = new Sharing(this.editor.graph.getModel(), doc);
														this.editor.undoManager.clear();
														var url = this.getSharingUrl();

														// Together with the
														// overridden hook
														// below, this allows
														// selection inside the
														// input that shows
														// the share URL. It
														// also allows context
														// menu for copy paste,
														// deselects when the
														// focus is lost
														// and selects all if
														// the mouse is clicked
														// inside the input
														// element.
														var select = 'var text=document.getElementById(\'shareUrl\');text.style.backgroundColor=\'\';text.focus();text.select();if(window.event!=null){window.event.cancelBubble=true;}return false;';
														var handlers = 'onmousedown="' + select + '" onclick="' + select + '"';

														if (mxClient.IS_IE && mxClient.IS_SVG)
														{
															handlers += ' onblur="document.selection.empty();"';
														} else if (mxClient.IS_IE)
														{
															handlers += ' onmouseup="' + select + '"';
														}

														var style = 'color:gray;border:0px;margin:0px;';

														if (highlight)
														{
															style += 'background-color:yellow;';
														}

														var url = this.getSharingUrl();
														var footer = document.getElementById('geFooter');

														this.editor.setStatus('<input id="shareUrl" style="' + style
																+ '" type="text" size="50" ' + 'value="' + url + '" readonly ' + handlers
																+ ' title="' + mxResources.get('shareLink') + '"/>');

														connection.on('disconnect', mxUtils.bind(this, function()
														{
															this.disconnect();
															this.editor.setStatus(mxResources.get('notConnected'));
														}));
													}
												}));
			} catch (err)
			{
				mxUtils.alert(err);
			}
		}
	};

	var editorUiIsSelectionAllowed = EditorUi.prototype.isSelectionAllowed;
	EditorUi.prototype.isSelectionAllowed = function(evt)
	{
		var txt = document.getElementById('shareUrl');

		if (txt != null && mxEvent.getSource(evt) == txt)
		{
			return true;
		}

		return editorUiIsSelectionAllowed.apply(this, arguments);
	};

	// Currently not available via UI
	EditorUi.prototype.disconnect = function()
	{
		if (this.sharing != null)
		{
			this.editor.setStatus('');
			this.sharing.doc.close();
			this.sharing.destroy();
			this.sharing = null;
		}
	};

	EditorUi.prototype.getSharingUrl = function()
	{
		if (this.sharing != null)
		{
			var port = (window.location.port != '' && window.location.port != '80') ? (':' + window.location.port) : '';
			var host = window.location.hostname;

			if (host == 'drive.diagram.ly')
			{
				host = 'www.draw.io';
			}

			return this
					.getUrl(window.location.protocol + '//' + host + port + window.location.pathname + '?share=' + this.sharing.doc.name);
		}

		return null;
	};

	// Replaces save button if alternative I/O is available (Chrome Dev-Channel
	// or Flash)
	EditorUi.prototype.replaceSaveButton = function(elt, dataCallback, filenameCallback, onComplete)
	{
		var result = null;
		var wnd = window;
		wnd.URL = wnd.webkitURL || wnd.URL;
		wnd.BlobBuilder = wnd.BlobBuilder || wnd.WebKitBlobBuilder || wnd.MozBlobBuilder;

		// Prefers BLOB Builder API in Chrome
		/*
		 * if (mxClient.IS_GC && (wnd.URL != null && wnd.BlobBuilder != null)) { //
		 * Experimental Chrome feature result =
		 * mxUtils.button(mxResources.get('save'), mxUtils.bind(this, function() {
		 * var bb = new wnd.BlobBuilder(); bb.append(dataCallback());
		 * 
		 * var a = wnd.document.createElement('a'); a.download =
		 * filenameCallback(); a.href =
		 * wnd.URL.createObjectURL(bb.getBlob('text/plain'));
		 * a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
		 * 
		 * var evt = document.createEvent("MouseEvents");
		 * evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false,
		 * false, false, false, 0, null); var allowDefault =
		 * a.dispatchEvent(evt); onComplete(); }));
		 * 
		 * elt.parentNode.replaceChild(result, elt); } else
		 */
		// FIXME:
		// - Possible to hover over button in IE (near right border)
		// - Removes focus from input element while entering filename
		// - No full hover simulation possible, only focus on button
		if (typeof (swfobject) != 'undefined' && swfobject.hasFlashPlayerVersion("10") && typeof (Downloadify) != 'undefined')
		{
			result = document.createElement('span');
			elt.parentNode.insertBefore(result, elt);

			// Adds a Flash object as a button
			Downloadify.create(result,
			{
				data : dataCallback,
				filename : filenameCallback,
				onComplete : onComplete,
				onCancel : function()
				{
				},
				onError : function()
				{
				},
				swf : 'js/downloadify/downloadify.swf',
				downloadImage : 'js/downloadify/transparent.png',
				width : elt.offsetWidth + 2,
				height : elt.offsetHeight + 2,
				transparent : true,
				append : true
			});

			// Fixes vertical shift of OBJECT node
			var dx = '-6px';

			if (mxClient.IS_IE && document.documentMode == 9)
			{
				dx = '-7px';
			} else if (mxClient.IS_IE)
			{
				dx = '-3px';
			}

			result.style.display = 'inline';
			result.style.position = 'absolute';
			result.style.left = (elt.offsetLeft + 20) + 'px';
			result.style.height = (elt.offsetHeight + 2) + 'px';
			result.style.width = (elt.offsetWidth + 2) + 'px';
			result.firstChild.style.marginBottom = dx;

			mxEvent.addListener(result, 'mouseover', function(evt)
			{
				elt.focus();
			});

			mxEvent.addListener(result, 'mouseout', function(evt)
			{
				elt.blur();
			});
		}

		return result;
	};

	// Extends Save Dialog to replace Save button
	if (!useLocalStorage)
	{
		EditorUi.prototype.saveFile = function(forceDialog)
		{
			// Required to use new SaveDialog below
			if (!forceDialog && this.editor.filename != null)
			{
				this.save(this.editor.getOrCreateFilename());
			} else
			{
				this.showDialog(new SaveDialog(this).container, 300, 80, true, true);
			}

			// Extends code for using flash in save button
			if (this.dialog != null)
			{
				// Finds elements inside the current dialog
				var findElt = mxUtils.bind(this, function(tagName)
				{
					var elts = document.getElementsByTagName(tagName);

					for ( var i = 0; i < elts.length; i++)
					{
						var parent = elts[i].parentNode;

						while (parent != null)
						{
							if (parent == this.dialog.container)
							{
								return elts[i];
							}

							parent = parent.parentNode;
						}
					}

					return null;
				});

				// Replaces the Save button
				var input = findElt('input');
				var saveBtn = findElt('button');

				if (input != null && saveBtn != null)
				{
					this.replaceSaveButton(saveBtn, mxUtils.bind(this, function()
					{
						return mxUtils.getXml(this.editor.getGraphXml());
					}), mxUtils.bind(this, function()
					{
						return input.value;
					}), mxUtils.bind(this, function()
					{
						this.editor.filename = input.value;
						this.editor.modified = false;
						this.hideDialog();
					}));
				}
			}
		};
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

})();