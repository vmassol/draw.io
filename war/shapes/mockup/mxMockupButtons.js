/**
 * $Id: mxMockupButtons.js,v 1.1 2013-01-16 16:06:57 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Multiline Button
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupMultilineButton(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupMultilineButton, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupMultilineButton.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var mainText = mxUtils.getValue(this.style, mxMockupC.BUTTON_TEXT, 'Main Text');
	var subText = mxUtils.getValue(this.style, mxMockupC.SUB_TEXT, 'Sub Text');
	var fontColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR, '#666666');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '17');
	c.translate(x, y);
	this.background(c, x, y, w, h);
	c.setShadow(false);
	this.mainText(c, x, y, w, h, mainText, fontSize, fontColor);
	this.subText(c, x, y, w, h, subText, fontSize / 1.4, fontColor);
};

mxShapeMockupMultilineButton.prototype.background = function(c, x, y, w, h)
{
	var buttonStyle = mxUtils.getValue(this.style, mxMockupC.BUTTON_STYLE, mxMockupC.ROUND).toString();
	var rSize = 10;
	c.begin();

	if (buttonStyle === mxMockupC.ROUND)
	{
		c.moveTo(0, rSize);
		c.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
		c.lineTo(w - rSize, 0);
		c.arcTo(rSize, rSize, 0, 0, 1, w, rSize);
		c.lineTo(w, h - rSize);
		c.arcTo(rSize, rSize, 0, 0, 1, w - rSize, h);
		c.lineTo(rSize, h);
		c.arcTo(rSize, rSize, 0, 0, 1, 0, h - rSize);
	}
	else if (buttonStyle === mxMockupC.CHEVRON)
	{
		c.moveTo(0, h * 0.1);
		c.arcTo(w * 0.0372, h * 0.1111, 0, 0, 1, w * 0.0334, 0);
		c.lineTo(w * 0.768, 0);
		c.arcTo(w * 0.0722, h * 0.216, 0, 0, 1, w * 0.8014, h * 0.0399);
		c.lineTo(w * 0.99, h * 0.4585);
		c.arcTo(w * 0.09, h * 0.1, 0, 0, 1, w * 0.99, h * 0.5415);
		c.lineTo(w * 0.8014, h * 0.9568);
		c.arcTo(w * 0.0722, h * 0.216, 0, 0, 1, w * 0.768, h);
		c.lineTo(w * 0.0334, h);
		c.arcTo(w * 0.0372, h * 0.1111, 0, 0, 1, 0, h * 0.9);
	}

	c.close();	
	c.fillAndStroke();
};

mxShapeMockupMultilineButton.prototype.mainText = function(c, x, y, w, h, text, fontSize, fontColor)
{
	c.begin();
	c.setFontSize(fontSize);
	c.setFontColor(fontColor);
	c.text(w * 0.5, h * 0.4, 0, 0, text, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxShapeMockupMultilineButton.prototype.subText = function(c, x, y, w, h, text, fontSize, fontColor)
{
	c.begin();
	c.setFontSize(fontSize);
	c.text(w * 0.5, h * 0.7, 0, 0, text, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_MULTILINE_BUTTON] = mxShapeMockupMultilineButton;

//**********************************************************************************************************************************************************
//Button
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupButton(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupButton, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupButton.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var mainText = mxUtils.getValue(this.style, mxMockupC.BUTTON_TEXT, 'Main Text');
	var fontColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR, '#666666').toString();
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '17').toString();
	c.translate(x, y);
	this.background(c, x, y, w, h);
	c.setShadow(false);
	this.mainText(c, x, y, w, h, mainText, fontSize, fontColor);
};

mxShapeMockupButton.prototype.background = function(c, x, y, w, h)
{
	var buttonStyle = mxUtils.getValue(this.style, mxMockupC.BUTTON_STYLE, mxMockupC.ROUND).toString();
	var rSize = 10;
	c.begin();

	if (buttonStyle === mxMockupC.ROUND)
	{
		c.moveTo(0, rSize);
		c.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
		c.lineTo(w - rSize, 0);
		c.arcTo(rSize, rSize, 0, 0, 1, w, rSize);
		c.lineTo(w, h - rSize);
		c.arcTo(rSize, rSize, 0, 0, 1, w - rSize, h);
		c.lineTo(rSize, h);
		c.arcTo(rSize, rSize, 0, 0, 1, 0, h - rSize);
	}
	else if (buttonStyle === mxMockupC.CHEVRON)
	{
		c.moveTo(0, h * 0.1);
		c.arcTo(w * 0.0372, h * 0.1111, 0, 0, 1, w * 0.0334, 0);
		c.lineTo(w * 0.768, 0);
		c.arcTo(w * 0.0722, h * 0.216, 0, 0, 1, w * 0.8014, h * 0.0399);
		c.lineTo(w * 0.99, h * 0.4585);
		c.arcTo(w * 0.09, h * 0.1, 0, 0, 1, w * 0.99, h * 0.5415);
		c.lineTo(w * 0.8014, h * 0.9568);
		c.arcTo(w * 0.0722, h * 0.216, 0, 0, 1, w * 0.768, h);
		c.lineTo(w * 0.0334, h);
		c.arcTo(w * 0.0372, h * 0.1111, 0, 0, 1, 0, h * 0.9);
	}

	c.close();	
	c.fillAndStroke();
};

mxShapeMockupButton.prototype.mainText = function(c, x, y, w, h, text, fontSize, fontColor)
{
	c.begin();
	c.setFontSize(fontSize);
	c.setFontColor(fontColor);
	c.text(w / 2, h / 2, 0, 0, text, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_BUTTON] = mxShapeMockupButton;

//**********************************************************************************************************************************************************
//Horizontal Button Bar
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupHorButtonBar(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupHorButtonBar, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupHorButtonBar.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var textStrings = mxUtils.getValue(this.style, mxMockupC.BUTTON_TEXT, '+Button 1, Button 2, Button 3').toString().split(',');
	var fontColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR, '#666666');
	var selectedFontColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR2, '#ffffff');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '17').toString();
	var frameColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#666666');
	var separatorColor = mxUtils.getValue(this.style, mxMockupC.STYLE_STROKECOLOR2, '#c4c4c4');
	var bgColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#ffffff');
	var selectedFillColor = mxUtils.getValue(this.style, mxMockupC.STYLE_FILLCOLOR2, '#008cff');
	var buttonNum = textStrings.length;
	var buttonWidths = new Array(buttonNum);
	var buttonTotalWidth = 0;
	var selectedButton = -1;
	var rSize = 10; //rounding size
	var labelOffset = 5;

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
	this.background(c, trueW, trueH, rSize, buttonNum, buttonWidths, labelOffset, minW, frameColor, separatorColor, bgColor, selectedFillColor, selectedButton);
	c.setShadow(false);

	var currWidth = 0;

	for (var i = 0; i < buttonNum; i++)
	{
		if (i === selectedButton)
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

mxShapeMockupHorButtonBar.prototype.background = function(c, w, h, rSize, buttonNum, buttonWidths, labelOffset, minW, frameColor, separatorColor, bgColor, selectedFillColor, selectedButton)
{
	c.begin();

	//draw the frame
	c.setStrokeColor(frameColor);
	c.setFillColor(bgColor);
	c.moveTo(0, rSize);
	c.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
	c.lineTo(w - rSize, 0);
	c.arcTo(rSize, rSize, 0, 0, 1, w, rSize);
	c.lineTo(w, h - rSize);
	c.arcTo(rSize, rSize, 0, 0, 1, w - rSize, h);
	c.lineTo(rSize, h);
	c.arcTo(rSize, rSize, 0, 0, 1, 0, h - rSize);
	c.close();
	c.fillAndStroke();

	//draw the button separators
	c.setStrokeColor(separatorColor);
	c.begin();
	for (var i = 1; i < buttonNum; i++)
	{
		if (i !== selectedButton && i !== (selectedButton + 1))
		{
			var currWidth = 0;

			for (var j = 0; j < i; j++)
			{
				currWidth += buttonWidths[j] + 2 * labelOffset;
			}

			currWidth = currWidth * w / minW;
			c.moveTo(currWidth, 0);
			c.lineTo(currWidth, h);
		}
	}

	c.stroke();

	//draw the selected button
	var buttonLeft = 0;
	c.setStrokeColor(mxConstants.NONE);
	c.setFillColor(selectedFillColor);

	for (var i = 0; i < selectedButton; i++)
	{
		buttonLeft += buttonWidths[i] + 2 * labelOffset;
	}

	buttonLeft = buttonLeft * w / minW;
	var buttonRight = (buttonWidths[selectedButton] + 2 * labelOffset) * w / minW;
	buttonRight += buttonLeft;

	if (selectedButton === 0)
	{
		c.begin();
		// we draw a path for the first button
		c.moveTo(0, rSize);
		c.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
		c.lineTo(buttonRight, 0);
		c.lineTo(buttonRight, h);
		c.lineTo(rSize, h);
		c.arcTo(rSize, rSize, 0, 0, 1, 0, h - rSize);
		c.close();
		c.fill();
	}
	else if (selectedButton === buttonNum - 1)
	{
		c.begin();
		// we draw a path for the last button
		c.moveTo(buttonLeft, 0);
		c.lineTo(buttonRight - rSize, 0);
		c.arcTo(rSize, rSize, 0, 0, 1, buttonRight, rSize);
		c.lineTo(buttonRight, h - rSize);
		c.arcTo(rSize, rSize, 0, 0, 1, buttonRight - rSize, h);
		c.lineTo(buttonLeft, h);
		c.close();
		c.fill();
	}
	else if (selectedButton !== -1)
	{
		c.begin();
		// we draw a path rectangle for one of the buttons in the middle
		c.moveTo(buttonLeft, 0);
		c.lineTo(buttonRight, 0);
		c.lineTo(buttonRight, h);
		c.lineTo(buttonLeft, h);
		c.close();
		c.fill();
	}

	//draw the frame again, to achieve a nicer effect
	c.setStrokeColor(frameColor);
	c.setFillColor(bgColor);
	c.begin();
	c.moveTo(0, rSize);
	c.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
	c.lineTo(w - rSize, 0);
	c.arcTo(rSize, rSize, 0, 0, 1, w, rSize);
	c.lineTo(w, h - rSize);
	c.arcTo(rSize, rSize, 0, 0, 1, w - rSize, h);
	c.lineTo(rSize, h);
	c.arcTo(rSize, rSize, 0, 0, 1, 0, h - rSize);
	c.close();
	c.stroke();
};

mxShapeMockupHorButtonBar.prototype.buttonText = function(c, w, h, textString, buttonWidth, fontSize, minW, trueW)
{
	if(textString.charAt(0) === mxMockupC.SELECTED)
	{
		textString = textString.substring(1);
	}

	c.begin();
	c.setFontSize(fontSize);
	c.text((w + buttonWidth * 0.5) * trueW / minW, h * 0.5, 0, 0, textString, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_HOR_BUTTON_BAR] = mxShapeMockupHorButtonBar;

//**********************************************************************************************************************************************************
//Vertical Button Bar
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupVerButtonBar(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupVerButtonBar, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupVerButtonBar.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var textStrings = mxUtils.getValue(this.style, mxMockupC.BUTTON_TEXT, '+Button 1, Button 2, Button 3').toString().split(',');
	var fontColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR, '#666666');
	var selectedFontColor = mxUtils.getValue(this.style, mxMockupC.STYLE_TEXTCOLOR2, '#ffffff');
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '17').toString();
	var frameColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#666666');
	var separatorColor = mxUtils.getValue(this.style, mxMockupC.STYLE_STROKECOLOR2, '#c4c4c4');
	var bgColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#ffffff');
	var selectedFillColor = mxUtils.getValue(this.style, mxMockupC.STYLE_FILLCOLOR2, '#008cff');
	var buttonNum = textStrings.length;
	var maxButtonWidth = 0;
	var selectedButton = -1;
	var rSize = 10; //rounding size
	var labelOffset = 5;

	for (var i = 0; i < buttonNum; i++)
	{
		var buttonText = textStrings[i];

		if(buttonText.charAt(0) === mxMockupC.SELECTED)
		{
			buttonText = textStrings[i].substring(1);
			selectedButton = i;
		}

		var currWidth = mxUtils.getSizeForString(buttonText, fontSize, mxConstants.DEFAULT_FONTFAMILY).width;
		
		if (currWidth > maxButtonWidth)
		{
			maxButtonWidth = currWidth;
		}
	}

	var minButtonHeight =  fontSize * 1.5;
	var minH = buttonNum * minButtonHeight;
	var trueH = Math.max(h, minH);
	var minW = 2 * labelOffset + maxButtonWidth;
	var trueW = Math.max(w, minW);

	c.translate(x, y);

	this.background(c, trueW, trueH, rSize, buttonNum, labelOffset, buttonNum * minButtonHeight, frameColor, separatorColor, bgColor, selectedFillColor, selectedButton, minButtonHeight);
	c.setShadow(false);

	var currWidth = 0;

	for (var i = 0; i < buttonNum; i++)
	{
		if (i === selectedButton)
		{
			c.setFontColor(selectedFontColor);
		}
		else
		{
			c.setFontColor(fontColor);
		}

		currWidth = currWidth + labelOffset;
		var currHeight = (i * minButtonHeight + minButtonHeight * 0.5) * trueH / minH;
		this.buttonText(c, trueW, currHeight, textStrings[i], fontSize);
	}
};

mxShapeMockupVerButtonBar.prototype.background = function(c, w, h, rSize, buttonNum, labelOffset, minH, frameColor, separatorColor, bgColor, selectedFillColor, selectedButton, minButtonHeight)
{
	c.begin();

	//draw the frame
	c.setStrokeColor(frameColor);
	c.setFillColor(bgColor);
	c.moveTo(0, rSize);
	c.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
	c.lineTo(w - rSize, 0);
	c.arcTo(rSize, rSize, 0, 0, 1, w, rSize);
	c.lineTo(w, h - rSize);
	c.arcTo(rSize, rSize, 0, 0, 1, w - rSize, h);
	c.lineTo(rSize, h);
	c.arcTo(rSize, rSize, 0, 0, 1, 0, h - rSize);
	c.close();
	c.fillAndStroke();

	//draw the button separators
	c.setStrokeColor(separatorColor);
	c.begin();
	
	for (var i = 1; i < buttonNum; i++)
	{
		if (i !== selectedButton && i !== (selectedButton + 1))
		{
			var currHeight = i * minButtonHeight * h / minH;

			c.moveTo(0, currHeight);
			c.lineTo(w, currHeight);
		}
	}

	c.stroke();

	//draw the selected button
	c.setStrokeColor(mxConstants.NONE);
	c.setFillColor(selectedFillColor);

	if (selectedButton === 0)
	{
		// we draw a path for the first button
		c.begin();
		var buttonBottom = minButtonHeight * h / minH;
		c.moveTo(0, rSize);
		c.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
		c.lineTo(w - rSize, 0);
		c.arcTo(rSize, rSize, 0, 0, 1, w, rSize);
		c.lineTo(w, buttonBottom);
		c.lineTo(0, buttonBottom);
		c.close();
		c.fill();
	}
	else if (selectedButton === buttonNum - 1)
	{
		// we draw a path for the last button
		c.begin();
		var buttonTop = h - minButtonHeight * h / minH;
		c.moveTo(0, buttonTop);
		c.lineTo(w, buttonTop);
		c.lineTo(w, h - rSize);
		c.arcTo(rSize, rSize, 0, 0, 1, w - rSize, h);
		c.lineTo(rSize, h);
		c.arcTo(rSize, rSize, 0, 0, 1, 0, h - rSize);
		c.close();
		c.fill();
	}
	else if (selectedButton !== -1)
	{
		// we draw a path rectangle for one of the buttons in the middle
		c.begin();
		var buttonTop = minButtonHeight * selectedButton * h / minH;
		var buttonBottom = minButtonHeight * (selectedButton + 1) * h / minH;
		c.moveTo(0, buttonTop);
		c.lineTo(w, buttonTop);
		c.lineTo(w, buttonBottom);
		c.lineTo(0, buttonBottom);
		c.close();
		c.fill();
	}

//	//draw the frame again, to achieve a nicer effect
	c.begin();
	c.setStrokeColor(frameColor);
	c.setFillColor(bgColor);
	c.moveTo(0, rSize);
	c.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
	c.lineTo(w - rSize, 0);
	c.arcTo(rSize, rSize, 0, 0, 1, w, rSize);
	c.lineTo(w, h - rSize);
	c.arcTo(rSize, rSize, 0, 0, 1, w - rSize, h);
	c.lineTo(rSize, h);
	c.arcTo(rSize, rSize, 0, 0, 1, 0, h - rSize);
	c.close();
	c.stroke();
};

mxShapeMockupVerButtonBar.prototype.buttonText = function(c, w, h, textString, fontSize)
{
	if(textString.charAt(0) === mxMockupC.SELECTED)
	{
		textString = textString.substring(1);
	}

	c.begin();
	c.setFontSize(fontSize);
	c.text((w * 0.5), h, 0, 0, textString, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_VER_BUTTON_BAR] = mxShapeMockupVerButtonBar;