(function()
{
	// TODO: Remove references to mxERC due to dynamic loading
	// To register for dynamic loading
	mxStencilRegistry.libraries['er'] = ['shapes/er/initER.js', 'shapes/er/mxER.js'];

	//Adds context menu
	/*var menusInit = Menus.prototype.init;
	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);

		mxResources.parse('entStyle=Entity Style');
		mxResources.parse(mxERC.ROUND + '=Round');
		mxResources.parse(mxERC.RECT + '=Rectangle');
		mxResources.parse(mxERC.DOUBLE_FRAME + '=Double Frame');

		this.put('entStyle', new Menu(mxUtils.bind(this, function(menu, parent)
		{
			this.styleChange(menu, mxResources.get(mxERC.ROUND), [mxERC.BUTTON_STYLE], [mxERC.ROUND, null], null, parent);
			this.styleChange(menu, mxResources.get(mxERC.RECT), [mxERC.BUTTON_STYLE], [mxERC.RECT, null], null, parent);
			this.styleChange(menu, mxResources.get(mxERC.DOUBLE_FRAME), [mxERC.BUTTON_STYLE], [mxERC.DOUBLE_FRAME, null], null, parent);
		})));
	};

	var menusCreatePopupMenu = Menus.prototype.createPopupMenu;

	Menus.prototype.createPopupMenu = function(menu, cell, evt)
	{
		menusCreatePopupMenu.apply(this, arguments);
		var graph = this.editorUi.editor.graph;

		if (graph.getSelectionCount() == 1)
		{
			var state = graph.view.getState(graph.getSelectionCell());

			if (state.style[mxConstants.STYLE_SHAPE] == mxERC.SHAPE_ENTITY)
			{
				menu.addSeparator();
				this.addSubmenu('entStyle', menu);
			}
		}
	};*/

	//Adds custom shape library
	var SidebarInit = Sidebar.prototype.init;
	Sidebar.prototype.init = function()
	{
		SidebarInit.apply(this, arguments);

		this.addPalette('er', 'ER (Test)', false, mxUtils.bind(this, function(content)
		{
			var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;' + mxConstants.STYLE_STROKEWIDTH + '=2;';
			content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=mxgraph.er.attribute;buttonText=Attribute;textColor=#000000;fontSize=17;buttonStyle=dblFrame;' + mxConstants.STYLE_FILLCOLOR + '=#ffffff;', 100, 100, 'Attribute'));
			/*content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=' + mxERC.SHAPE_BACHMANS + ';' + mxERC.STYLE_TEXTCOLOR + '=#000000;' + mxConstants.STYLE_FONTSIZE + '=17;', 300, 200, 'ERD Bachman\'s Notation'));
			content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=' + mxERC.SHAPE_CHENS + ';' + mxERC.STYLE_FONTCOLOR + '=#000000;' + mxConstants.STYLE_FONTSIZE + '=17;', 300, 100, 'ERD Chen\'s Notation'));
			content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=' + mxERC.SHAPE_CLOUD + ';' + mxERC.BUTTON_TEXT + '=Cloud;' + mxERC.STYLE_FONTCOLOR + '=#000000;' + mxConstants.STYLE_FONTSIZE + '=17;', 100, 100, 'Cloud'));
			content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=' + mxERC.SHAPE_ENTITY + ';' + mxERC.BUTTON_STYLE + '=' + mxERC.DOUBLE_FRAME + ';' + mxConstants.STYLE_FILLCOLOR + '=#ffffff;' + mxERC.BUTTON_TEXT + '=Entity1;', 100, 100, 'Entity'));
			content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=' + mxERC.SHAPE_ENTITY_EXT + ';' + mxERC.BUTTON_TEXT + '=Entity;' + mxConstants.STYLE_FILLCOLOR + '=#008cff;' + mxERC.STYLE_FILLCOLOR2 + '=#ffffff;' + mxConstants.STYLE_FONTSIZE + '=17;' + mxERC.SUB_TEXT + '=+ attribute 1,+ attribute 2,+ attribute 3;', 100, 100, 'Entity Extended'));
			content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=' + mxERC.SHAPE_IE + ';' + mxERC.STYLE_FONTCOLOR + '=#000000;' + mxConstants.STYLE_FONTSIZE + '=17;', 350, 120, 'ERD Information Engineering Notation'));
			content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=' + mxERC.SHAPE_HAS + ';' + mxERC.BUTTON_TEXT + '=Has;' + mxERC.STYLE_FONTCOLOR + '=#000000;' + mxConstants.STYLE_FONTSIZE + '=17;' + mxERC.BUTTON_STYLE + '=' + mxERC.RHOMBUS + ';', 100, 100, 'Has'));
			content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=' + mxERC.SHAPE_HIERARCHY + ';' + mxERC.BUTTON_TEXT + '=main;' + mxERC.SUB_TEXT + '=sub;' + mxERC.STYLE_FONTCOLOR + '=#000000;' + mxConstants.STYLE_FONTSIZE + '=17;' + mxERC.BUTTON_STYLE + '=' + mxERC.ROUND + ';', 100, 100, 'Hierarchy'));
			content.appendChild(this.createVertexTemplate(s + mxConstants.STYLE_SHAPE + '=' + mxERC.SHAPE_NOTE + ';' + mxERC.BUTTON_TEXT + '=Note;' + mxERC.STYLE_FONTCOLOR + '=#000000;' + mxConstants.STYLE_FONTSIZE + '=17;' + mxERC.fillColor2 + '=#ffffff;', 100, 100, 'Note'));

			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ZERO_TO_MANY + ';endFill=1;', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ONE_TO_MANY + ';', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_MANDATORY_ONE + ';', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_STARTARROW + '=' + mxERC.MARKER_MANDATORY_ONE + ';' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_MANDATORY_ONE + ';', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ONE + ';endFill=1;', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ZERO_TO_ONE + ';endFill=1;', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_MANY + ';endFill=1;', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_STARTARROW + '=' + mxERC.MARKER_MANY + ';' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_MANY + ';', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_STARTARROW + '=' + mxERC.MARKER_ZERO_TO_ONE + ';' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ZERO_TO_MANY + ';', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_STARTARROW + '=' + mxERC.MARKER_MANDATORY_ONE + ';' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ZERO_TO_MANY + ';', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_STARTARROW + '=' + mxERC.MARKER_MANDATORY_ONE + ';' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ONE_TO_MANY + ';', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_STARTARROW + '=' + mxERC.MARKER_ZERO_TO_ONE + ';' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ONE_TO_MANY + ';', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_STARTARROW + '=' + mxERC.MARKER_ONE_TO_MANY + ';' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ONE_TO_MANY + ';', 100, 100));
			content.appendChild(this.createEdgeTemplate('edgeStyle=none;' + mxConstants.STYLE_STARTARROW + '=' + mxERC.MARKER_ZERO_TO_MANY + ';' + mxConstants.STYLE_ENDARROW + '=' + mxERC.MARKER_ONE_TO_MANY + ';', 100, 100));*/
		}));
	};
})();
