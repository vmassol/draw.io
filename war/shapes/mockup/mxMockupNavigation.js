/**
 * $Id: mxMockupNavigation.js,v 1.1 2013-01-16 16:06:57 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Breadcrumb
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupBreadcrumb(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
 * Extends mxShape.
 */
mxUtils.extend(mxShapeMockupBreadcrumb, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupBreadcrumb.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var textStrings = mxUtils.getValue(this.style, mxMockupC.BUTTON_TEXT, 'Layer 1, Layer 2, Layer 3').toString().split(',');
	var fontColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR, '#666666');
	var selectedFontColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR2, '#008cff');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '17').toString();
	var separatorColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#c4c4c4');
	var buttonNum = textStrings.length;
	var buttonWidths = new Array(buttonNum);
	var buttonTotalWidth = 0;
	var labelOffset = 10;

	for (var i = 0; i < buttonNum; i++)
	{
		buttonWidths[i] = mxUtils.getSizeForString(textStrings[i], fontSize, mxConstants.DEFAULT_FONTFAMILY).width;
		buttonTotalWidth += buttonWidths[i];
	}

	var trueH = Math.max(h, fontSize * 1.5, 20);
	var minW = 2 * labelOffset * buttonNum + buttonTotalWidth;
	var trueW = Math.max(w, minW);
	c.translate(x, y);
	c.setShadow(false);

	this.separators(c, trueW, trueH, buttonNum, buttonWidths, labelOffset, minW, separatorColor);
	var currWidth = 0;

	for (var i = 0; i < buttonNum; i++)
	{
		if (i + 1 === buttonNum)
		{
			c.setFontColor(selectedFontColor);
		}
		else
		{
			c.setFontColor(fontColor);
		}

		currWidth = currWidth + labelOffset;
		this.buttonText(c, currWidth, trueH, textStrings[i], buttonWidths[i], fontSize, minW, trueW);
		currWidth = currWidth + buttonWidths[i] + labelOffset;
	}
};

mxShapeMockupBreadcrumb.prototype.separators = function(c, w, h, buttonNum, buttonWidths, labelOffset, minW, separatorColor)
{
	//draw the button separators
	c.setStrokeColor(separatorColor);
	var midY = h * 0.5;
	var size = 5;
	c.begin();

	for (var i = 1; i < buttonNum; i++)
	{
		var currWidth = 0;

		for (var j = 0; j < i; j++)
		{
			currWidth += buttonWidths[j] + 2 * labelOffset;
		}

		currWidth = currWidth * w / minW;
		c.moveTo(currWidth - size * 0.5, midY - size);
		c.lineTo(currWidth + size * 0.5, midY);
		c.lineTo(currWidth - size * 0.5, midY + size);
	}
	c.stroke();
};

mxShapeMockupBreadcrumb.prototype.buttonText = function(c, w, h, textString, buttonWidth, fontSize, minW, trueW)
{
	c.begin();
	c.setFontSize(fontSize);
	c.text((w + buttonWidth * 0.5) * trueW / minW, h * 0.5, 0, 0, textString, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_BREADCRUMB] = mxShapeMockupBreadcrumb;

//**********************************************************************************************************************************************************
//Step Bar
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupStepBar(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
 * Extends mxShape.
 */
mxUtils.extend(mxShapeMockupStepBar, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupStepBar.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var textStrings = mxUtils.getValue(this.style, mxMockupC.BUTTON_TEXT, 'Step 1, Step 2, Step 3').toString().split(',');
	var fontColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR, '#666666');
	var currColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR2, '#008cff');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '17').toString();
	var bgColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#c4c4c4');
	var doneColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#666666');
	var buttonNum = textStrings.length;
	var buttonWidths = new Array(buttonNum);
	var buttonTotalWidth = 0;
	var labelOffset = 10;
	var selectedButton = -1;

	for (var i = 0; i < buttonNum; i++)
	{
		var buttonText = textStrings[i];

		if(buttonText.charAt(0) === mxMockupC.SELECTED)
		{
			buttonText = textStrings[i].substring(1);
			selectedButton = i;
		}

		buttonWidths[i] = mxUtils.getSizeForString(buttonText, fontSize, mxConstants.DEFAULT_FONTFAMILY).width;

		buttonTotalWidth += buttonWidths[i];
	}

	var trueH = Math.max(h, fontSize * 1.5, 20);
	var minW = 2 * labelOffset * buttonNum + buttonTotalWidth;
	var trueW = Math.max(w, minW);
	c.translate(x, y);

	this.stepLineBg(c, trueW, trueH, buttonNum, buttonWidths, labelOffset, minW, bgColor, fontSize, minW, trueW);
	c.setShadow(false);

	this.stepLineFg(c, trueW, trueH, buttonNum, buttonWidths, labelOffset, minW, bgColor, doneColor, currColor, fontSize, minW, trueW, selectedButton);
	var currWidth = 0;

	for (var i = 0; i < buttonNum; i++)
	{
		if (i >= selectedButton)
		{
			c.setFontColor(fontColor);
		}
		else
		{
			c.setFontColor(bgColor);
		}

		currWidth = currWidth + labelOffset;
		this.buttonText(c, currWidth, trueH, textStrings[i], buttonWidths[i], fontSize, minW, trueW);
		currWidth = currWidth + buttonWidths[i] + labelOffset;
	}
};

mxShapeMockupStepBar.prototype.stepLineBg = function(c, w, h, buttonNum, buttonWidths, labelOffset, minW, bgColor, fontSize, minW, trueW)
{
	//draw the button separators
	c.setStrokeColor(bgColor);
	c.setFillColor(bgColor);
	var midY = fontSize * 2;
	var size = 10;
	var startX = 0;
	var endX = 0;

	for (var i = 0; i < buttonNum; i++)
	{
		var currWidth = 0;

		for (var j = 0; j < i; j++)
		{
			currWidth += buttonWidths[j] + 2 * labelOffset;
		}

		currWidth += buttonWidths[i] * 0.5 + labelOffset;

		currWidth = currWidth * w / minW;

		if (i === 0)
		{
			startX = currWidth;	
		}
		else if (i + 1 === buttonNum)
		{
			endX = currWidth;
		}

		c.begin();
		c.ellipse(currWidth - size, midY - size, 2 * size, 2 * size);
		c.fillAndStroke();
	}

	c.begin();
	c.rect(startX, midY - size * 0.2, endX - startX, size * 0.4);
	c.fillAndStroke();
};



mxShapeMockupStepBar.prototype.stepLineFg = function(c, w, h, buttonNum, buttonWidths, labelOffset, minW, bgColor, doneColor, currColor, fontSize, minW, trueW, selectedButton)
{
	//draw the button separators
	c.setStrokeColor(doneColor);
	var midY = fontSize * 2;
	var size = 10 * 0.75;
	var startX = 0;
	var endX = 0;
	var strokeWidth = mxUtils.getValue(this.style, mxConstants.STYLE_STROKEWIDTH, '1');

	for (var i = 0; i <= selectedButton; i++)
	{
		var currWidth = 0;

		for (var j = 0; j < i; j++)
		{
			currWidth += buttonWidths[j] + 2 * labelOffset;
		}

		currWidth += buttonWidths[i] * 0.5 + labelOffset;

		currWidth = currWidth * w / minW;

		if (i === 0)
		{
			startX = currWidth;	
		}
		else if (i === selectedButton)
		{
			endX = currWidth;
		}
	}
	
	c.setFillColor(doneColor);
	c.begin();
	c.rect(startX, midY - size * 0.15, endX - startX, size * 0.3);
	c.fill();
	c.setFillColor(bgColor);

	for (var i = 0; i <= selectedButton; i++)
	{
		var currWidth = 0;

		for (var j = 0; j < i; j++)
		{
			currWidth += buttonWidths[j] + 2 * labelOffset;
		}

		currWidth += buttonWidths[i] * 0.5 + labelOffset;

		currWidth = currWidth * w / minW;

		if (i === 0)
		{
			startX = currWidth;	
		}
		else if (i + 1 === selectedButton)
		{
			endX = currWidth;
		}

		if (i < selectedButton)
		{
			c.setStrokeWidth(strokeWidth);
			c.begin();
			c.ellipse(currWidth - size, midY - size, 2 * size, 2 * size);
			c.fillAndStroke();

			c.setStrokeWidth(strokeWidth * 0.5);
			c.begin();
			c.ellipse(currWidth - size * 0.6, midY - size * 0.6, 2 * size * 0.6, 2 * size * 0.6);
			c.fillAndStroke();
		}
		else
		{
			c.setStrokeWidth(strokeWidth);
			c.setFillColor(bgColor);
			c.setStrokeColor(bgColor);
			c.begin();
			c.ellipse(currWidth - size / 0.75, midY - size / 0.75, 2 * size / 0.75, 2 * size / 0.75);
			c.fillAndStroke();

			c.setStrokeWidth(strokeWidth);
			c.setFillColor('#ffffff');
			c.setStrokeColor('#ffffff');
			c.begin();
			c.ellipse(currWidth - size, midY - size, 2 * size, 2 * size);
			c.fillAndStroke();

			c.setFillColor(currColor);
			c.setStrokeColor(currColor);
			c.setStrokeWidth(strokeWidth * 0.5);
			c.begin();
			c.ellipse(currWidth - size * 0.7, midY - size * 0.7, 2 * size * 0.7, 2 * size * 0.7);
			c.fillAndStroke();
		}
	}

//	c.moveTo(currWidth - size * 0.5, midY - size);
//	c.lineTo(currWidth + size * 0.5, midY);
//	c.lineTo(currWidth - size * 0.5, midY + size);
//	c.begin();
//	c.rect(startX, midY - size * 0.2, endX - startX, size * 0.4);
//	c.fillAndStroke();
};

mxShapeMockupStepBar.prototype.buttonText = function(c, w, h, textString, buttonWidth, fontSize, minW, trueW)
{
	if(textString.charAt(0) === mxMockupC.SELECTED)
	{
		textString = textString.substring(1);
	}

	c.begin();
	c.setFontSize(fontSize);
	c.text((w + buttonWidth * 0.5) * trueW / minW, fontSize * 0.5, 0, 0, textString, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_STEP_BAR] = mxShapeMockupStepBar;