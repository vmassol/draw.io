/**
 * $Id: mxMockupContainers.js,v 1.1 2013-01-16 16:06:57 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Video Player
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupVideoPlayer(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupVideoPlayer, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupVideoPlayer.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var bgColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#ffffff');
	var buttonColor = mxUtils.getValue(this.style, mxMockupC.STYLE_FILLCOLOR2, '#c4c4c4');
	var frameColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#666666');
	var filledColor = mxUtils.getValue(this.style, mxMockupC.STYLE_STROKECOLOR2, '#008cff');
	var emptyColor = mxUtils.getValue(this.style, mxMockupC.STYLE_STROKECOLOR3, '#c4c4c4');
	c.translate(x, y);
	this.background(c, x, y, w, h, bgColor, frameColor);
	c.setShadow(false);
	this.otherShapes(c, x, y, w, h, buttonColor, frameColor, filledColor, emptyColor);
};

mxShapeMockupVideoPlayer.prototype.background = function(c, x, y, w, h, bgColor, frameColor)
{
	c.setFillColor(bgColor);
	c.setStrokeColor(frameColor);
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();	
	c.fillAndStroke();
};

mxShapeMockupVideoPlayer.prototype.otherShapes = function(c, x, y, w, h, buttonColor, frameColor, filledColor, emptyColor)
{
	var barPos = mxUtils.getValue(this.style, mxMockupC.BAR_POS, '20');
	barPos = Math.max(0, barPos);
	barPos = Math.min(100, barPos);

	var barHeight = mxUtils.getValue(this.style, mxMockupC.BAR_HEIGHT, '30');
	var strokeWidth = mxUtils.getValue(this.style, mxConstants.STYLE_STROKEWIDTH, '1');
	var buttonR = 8;
	var barY = h - barHeight;

	var barMin = buttonR;
	var barMax = w - buttonR;
	var barRange = barMax - barMin;
	var realBarPos = barRange * barPos / 100;
	var barEnd = barMin + realBarPos;

	//progress bar
	c.setStrokeColor(filledColor);
	c.begin();
	c.moveTo(0, barY);
	c.lineTo(barEnd, barY);
	c.stroke();
	c.setStrokeColor(emptyColor);
	c.begin();
	c.moveTo(barEnd, barY);
	c.lineTo(w, barY);
	c.stroke();

	//progress bar button
	c.setStrokeColor(frameColor);
	c.begin();
	c.ellipse(barEnd - buttonR, barY - buttonR, 2 * buttonR, 2 * buttonR);
	c.fillAndStroke();

	c.begin();
	c.setStrokeWidth(strokeWidth / 2);
	c.ellipse(barEnd - buttonR * 0.5, barY - buttonR * 0.5, buttonR, buttonR);
	c.fillAndStroke();
	c.setStrokeWidth(strokeWidth);

	var iconSize = barHeight * 0.3;
	var iconY = h - (barHeight + iconSize) * 0.5;
	var iconX = barHeight * 0.3;
	c.setFillColor(emptyColor);
	c.setStrokeColor(emptyColor);

	//play icon
	c.begin();
	c.moveTo(iconX, iconY);
	c.lineTo(iconX + iconSize, iconY + iconSize * 0.5);
	c.lineTo(iconX, iconY + iconSize);
	c.close();
	c.fillAndStroke();

	//volume icon
	var speakerX = barHeight;
	var speakerY = h - barHeight;
	c.moveTo(speakerX + barHeight * 0.05, speakerY + barHeight * 0.4);
	c.lineTo(speakerX + barHeight * 0.15, speakerY + barHeight * 0.4);
	c.lineTo(speakerX + barHeight * 0.3, speakerY + barHeight * 0.25);
	c.lineTo(speakerX + barHeight * 0.3, speakerY + barHeight * 0.75);
	c.lineTo(speakerX + barHeight * 0.15, speakerY + barHeight * 0.6);
	c.lineTo(speakerX + barHeight * 0.05, speakerY + barHeight * 0.6);
	c.close();
	c.fillAndStroke();

	c.begin();
	c.moveTo(speakerX + barHeight * 0.4, speakerY + barHeight * 0.35);
	c.arcTo(barHeight * 0.2, barHeight * 0.3, 0, 0, 1, speakerX + barHeight * 0.4, speakerY + barHeight * 0.65);
	c.moveTo(speakerX + barHeight * 0.425, speakerY + barHeight * 0.25);
	c.arcTo(barHeight * 0.225, barHeight * 0.35, 0, 0, 1, speakerX + barHeight * 0.425, speakerY + barHeight * 0.75);
	c.stroke();

	//fullscreen button
	var screenX = w - barHeight * 1.3;
	c.begin();
	c.moveTo(screenX + barHeight * 0.1, speakerY + barHeight * 0.4);
	c.lineTo(screenX + barHeight * 0.1, speakerY + barHeight * 0.3);
	c.lineTo(screenX + barHeight * 0.25, speakerY + barHeight * 0.3);

	c.moveTo(screenX + barHeight * 0.1, speakerY + barHeight * 0.6);
	c.lineTo(screenX + barHeight * 0.1, speakerY + barHeight * 0.7);
	c.lineTo(screenX + barHeight * 0.25, speakerY + barHeight * 0.7);

	c.moveTo(screenX + barHeight * 0.9, speakerY + barHeight * 0.4);
	c.lineTo(screenX + barHeight * 0.9, speakerY + barHeight * 0.3);
	c.lineTo(screenX + barHeight * 0.75, speakerY + barHeight * 0.3);

	c.moveTo(screenX + barHeight * 0.9, speakerY + barHeight * 0.6);
	c.lineTo(screenX + barHeight * 0.9, speakerY + barHeight * 0.7);
	c.lineTo(screenX + barHeight * 0.75, speakerY + barHeight * 0.7);
	c.stroke();

	c.begin();
	c.setFontSize(barHeight * 0.5);
	c.setFontColor(emptyColor);
	c.text(barHeight * 1.9, h - barHeight * 0.45, 0, 0, '0:00/3:53', mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_VIDEO_PLAYER] = mxShapeMockupVideoPlayer;

//**********************************************************************************************************************************************************
//Accordion
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupAccordion(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupAccordion, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupAccordion.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var textStrings = mxUtils.getValue(this.style, mxMockupC.BUTTON_TEXT, '+Group 1, Group 2, Group 3').toString().split(',');
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
		var currHeight = 0;

		if (selectedButton === -1 || i <= selectedButton)
		{	
			currHeight = (i * minButtonHeight + minButtonHeight * 0.5);
		}
		else
		{
			currHeight = trueH - (buttonNum - i - 0.5) * minButtonHeight;
		}

		this.buttonText(c, trueW, currHeight, textStrings[i], fontSize);
	}
};

mxShapeMockupAccordion.prototype.background = function(c, w, h, rSize, buttonNum, labelOffset, minH, frameColor, separatorColor, bgColor, selectedFillColor, selectedButton, minButtonHeight)
{
	c.begin();

	//draw the frame
	c.setStrokeColor(frameColor);
	c.setFillColor(bgColor);
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();
	c.fillAndStroke();

	//draw the button separators
	c.setStrokeColor(separatorColor);
	c.begin();

	for (var i = 1; i < buttonNum; i++)
	{
		if (i !== selectedButton)
		{
			if (selectedButton === -1 || i < selectedButton)
			{
				var currHeight = i * minButtonHeight;
				c.moveTo(0, currHeight);
				c.lineTo(w, currHeight);
			}
			else
			{
				var currHeight = h - (buttonNum - i) * minButtonHeight;
				c.moveTo(0, currHeight);
				c.lineTo(w, currHeight);
			}
		}
	}

	c.stroke();

	//draw the selected button
	c.setStrokeColor(mxConstants.NONE);
	c.setFillColor(selectedFillColor);

	if (selectedButton !== -1)
	{
		c.begin();
		var buttonTop = minButtonHeight * selectedButton;
		var buttonBottom = minButtonHeight * (selectedButton + 1);
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
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();
	c.stroke();
};

mxShapeMockupAccordion.prototype.buttonText = function(c, w, h, textString, fontSize)
{
	if(textString.charAt(0) === mxMockupC.SELECTED)
	{
		textString = textString.substring(1);
	}

	c.begin();
	c.setFontSize(fontSize);
	c.text((w * 0.5), h, 0, 0, textString, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_ACCORDION] = mxShapeMockupAccordion;

//**********************************************************************************************************************************************************
//Browser Window
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeMockupBrowserWindow(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupBrowserWindow, mxShape);

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeMockupBrowserWindow.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var bgColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#ffffff');
	var frameColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#666666');
	var closeColor = mxUtils.getValue(this.style, mxMockupC.STYLE_STROKECOLOR2, '#008cff');
	var insideColor = mxUtils.getValue(this.style, mxMockupC.STYLE_STROKECOLOR3, '#c4c4c4');
	c.translate(x, y);
	this.background(c, x, y, w, h, bgColor, frameColor);
	c.setShadow(false);
	this.otherShapes(c, x, y, w, h, frameColor, insideColor, closeColor);
};

mxShapeMockupBrowserWindow.prototype.background = function(c, x, y, w, h, bgColor, frameColor)
{
	c.setFillColor(bgColor);
	c.setStrokeColor(frameColor);
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();	
	c.fillAndStroke();
};

mxShapeMockupBrowserWindow.prototype.otherShapes = function(c, x, y, w, h, frameColor, insideColor, closeColor)
{
	var strokeWidth = mxUtils.getValue(this.style, mxConstants.STYLE_STROKEWIDTH, '1');

	//window buttons
	c.setStrokeColor(frameColor);
	c.begin();
	c.ellipse(w - 80, 10, 20, 20);
	c.stroke();
	
	c.begin();
	c.ellipse(w - 55, 10, 20, 20);
	c.stroke();
	
	c.setStrokeColor(closeColor);
	c.begin();
	c.ellipse(w - 30, 10, 20, 20);
	c.stroke();
	
	c.setStrokeColor(insideColor);
	//lines
	c.begin();
	c.moveTo(0, 40);
	c.lineTo(30, 40);
	c.lineTo(30, 15);
	c.arcTo(5, 5, 0, 0, 1, 35, 10);
	c.lineTo(170, 10);
	c.arcTo(5, 5, 0, 0, 1, 175, 15);
	c.lineTo(175, 40);
	c.lineTo(w, 40);
	c.stroke();
	
	c.begin();
	c.moveTo(0, 110);
	c.lineTo(w, 110);
	c.stroke();
	
	//address field
	c.begin();
	c.moveTo(100, 60);
	c.arcTo(5, 5, 0, 0, 1, 105, 55);
	c.lineTo(w - 15, 55);
	c.arcTo(5, 5, 0, 0, 1, w - 10, 60);
	c.lineTo(w - 10, 85);
	c.arcTo(5, 5, 0, 0, 1, w - 15, 90);
	c.lineTo(105, 90);
	c.arcTo(5, 5, 0, 0, 1, 100, 85);
	c.close();
	c.stroke();
	
	//text
	c.setFontColor(frameColor);
	c.setFontSize(17);
	c.text(65, 25, 0, 0, 'Page 1', mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
	c.text(130, 73, 0, 0, 'http://www.draw.io', mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
	c.stroke();
	
	//icon on tab
	c.translate(37, 17);
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(11, 0);
	c.lineTo(15, 4);
	c.lineTo(15, 18);
	c.lineTo(0, 18);
	c.close();
	c.stroke();
	
	c.setStrokeWidth(strokeWidth * 0.5); //maybe because of this (read later)
	c.begin();
	c.moveTo(11, 0);
	c.lineTo(11, 4);
	c.lineTo(15, 5);
	c.stroke();

	//icon in address bar
	c.setStrokeWidth(strokeWidth * 2); // i'm not sure why i have to multiply here
	c.translate(70, 47);
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(11, 0);
	c.lineTo(15, 4);
	c.lineTo(15, 18);
	c.lineTo(0, 18);
	c.close();
	c.stroke();
	
	c.setStrokeWidth(strokeWidth * 0.5);
	c.begin();
	c.moveTo(11, 0);
	c.lineTo(11, 4);
	c.lineTo(15, 5);
	c.stroke();
	
	//back
	var iSi = 20; //icon size
	c.setFillColor(insideColor);
	c.begin();
	c.setStrokeWidth(strokeWidth * 2); // i'm not sure why i have to multiply here
	c.translate(-95, 0);
	c.moveTo(0, iSi * 0.5);
	c.lineTo(iSi * 0.5, 0);
	c.lineTo(iSi * 0.5, iSi * 0.3);
	c.lineTo(iSi, iSi * 0.3);
	c.lineTo(iSi, iSi * 0.7);
	c.lineTo(iSi * 0.5, iSi * 0.7);
	c.lineTo(iSi * 0.5, iSi);
	c.close();
	c.fillAndStroke();
	
	//forward
	c.begin();
	c.translate(30, 0);
	c.moveTo(iSi, iSi * 0.5);
	c.lineTo(iSi * 0.5, 0);
	c.lineTo(iSi * 0.5, iSi * 0.3);
	c.lineTo(0, iSi * 0.3);
	c.lineTo(0, iSi * 0.7);
	c.lineTo(iSi * 0.5, iSi * 0.7);
	c.lineTo(iSi * 0.5, iSi);
	c.close();
	c.fillAndStroke();
	
	//refresh
	c.begin();
	c.translate(30, 0);
	c.moveTo(iSi * 0.78, iSi * 0.665);
	c.arcTo(iSi * 0.3, iSi * 0.3, 0, 1, 1, iSi * 0.675, iSi * 0.252);
	c.lineTo(iSi * 0.595, iSi * 0.325);
	c.lineTo(iSi * 0.99, iSi * 0.415);
	c.lineTo(iSi * 0.9, iSi * 0.04);
	c.lineTo(iSi * 0.815, iSi * 0.12);
	c.arcTo(iSi * 0.49, iSi * 0.49, 0, 1, 0, iSi * 0.92, iSi * 0.8);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_BROWSER_WINDOW] = mxShapeMockupBrowserWindow;

//**********************************************************************************************************************************************************
//User, Male
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeMockupUserMale(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupUserMale, mxShape);

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeMockupUserMale.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var bgColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#ffffff');
	var frameColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#666666');
	var insideColor = mxUtils.getValue(this.style, mxMockupC.STYLE_STROKECOLOR2, '#008cff');
	c.translate(x, y);
	this.background(c, x, y, w, h, bgColor, frameColor);
	c.setShadow(false);
	this.otherShapes(c, x, y, w, h, insideColor, frameColor);
};

mxShapeMockupUserMale.prototype.background = function(c, x, y, w, h, bgColor, frameColor)
{
	c.setFillColor(bgColor);
	c.setStrokeColor(frameColor);
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();	
	c.fillAndStroke();
};

mxShapeMockupUserMale.prototype.otherShapes = function(c, x, y, w, h, insideColor, frameColor)
{
	//head left
	c.setStrokeColor(insideColor);
	c.setLineCap('round');
	c.setLineJoin('round');
	c.begin();
	c.moveTo(w * 0.5, h * 0.6721);
	c.curveTo(w * 0.3891, h * 0.6721, w * 0.31, h * 0.5648, w * 0.31, h * 0.3962);
	c.curveTo(w * 0.31, h * 0.3656, w * 0.3012, h * 0.3473, w * 0.3051, h * 0.3227);
	c.curveTo(w * 0.3126, h * 0.2762, w * 0.3124, h * 0.2212, w * 0.332, h * 0.1939);
	c.curveTo(w * 0.354, h * 0.1633, w * 0.4382, h * 0.12, w * 0.5, h * 0.12);
	c.stroke();
	
	//left ear
	c.begin();
	c.moveTo(w * 0.3046, h * 0.3716);
	c.curveTo(w * 0.3046, h * 0.3716, w * 0.3046, h * 0.341, w * 0.2826, h * 0.3594);
	c.curveTo(w * 0.2606, h * 0.3778, w * 0.2661, h * 0.4452, w * 0.266, h * 0.4452);
	c.quadTo(w * 0.2715, h * 0.4942, w * 0.277, h * 0.5065);
	c.curveTo(w * 0.2825, h * 0.5187, w * 0.277, h * 0.5187, w * 0.2935, h * 0.5371);
	c.curveTo(w * 0.31, h * 0.5554, w * 0.3375, h * 0.5615, w * 0.3375, h * 0.5616);
	c.stroke();

	// left shoulder
	c.begin();
	c.moveTo(w * 0.3829, h * 0.6213);
	c.curveTo(w * 0.3829, h * 0.6213, w * 0.405, h * 0.7704, w * 0.2921, h * 0.7888);
	c.curveTo(w * 0.2536, h * 0.795, w * 0.1328, h * 0.85, w * 0.1052, h * 0.8745);
	c.curveTo(w * 0.0776, h * 0.899, w * 0.0641, h * 0.9316, w * 0.0571, h * 0.9622);
	c.quadTo(w * 0.05, h, w * 0.05, h);
	c.stroke();

	// left hairline
	c.begin();
	c.moveTo(w * 0.3427, h * 0.4185);
	c.curveTo(w * 0.3427, h * 0.4185, w * 0.3427, h * 0.3839, w * 0.3427, h * 0.3593);
	c.curveTo(w * 0.3427, h * 0.3348, w * 0.3663, h * 0.3103, w * 0.3718, h * 0.3041);
	c.curveTo(w * 0.3773, h * 0.298, w * 0.3822, h * 0.2673, w * 0.3877, h * 0.2551);
	c.curveTo(w * 0.3932, h * 0.2429, w * 0.4095, h * 0.2429, w * 0.4259, h * 0.2367);
	c.curveTo(w * 0.4424, h * 0.2306, w * 0.4984, h * 0.2357, w * 0.4984, h * 0.2357);
	c.stroke();

	//shirt
	c.begin();
	c.moveTo(w * 0.365, h * 0.7427);
	c.curveTo(w * 0.365, h * 0.7427, w * 0.3772, h * 0.8076, w * 0.4286, h * 0.8224);
	c.curveTo(w * 0.4816, h * 0.8377, w * 0.5028, h * 0.8347, w * 0.5028, h * 0.8347);
	c.stroke();
	
	c.begin();
	c.moveTo(w * 0.3322, h * 0.7764);
	c.curveTo(w * 0.3322, h * 0.7764, w * 0.3556, h * 0.8386, w * 0.4038, h * 0.8684);
	c.curveTo(w * 0.4533, h * 0.8991, w * 0.5029, h * 0.8929, w * 0.5029, h * 0.8929);
	c.stroke();
	
	c.begin();
	c.moveTo(w * 0.2717, h * 0.9);
	c.lineTo(w * 0.2717, h);
	c.stroke();
	
	c.begin();
	c.moveTo(w * 0.1671, h * 0.8991);
	c.curveTo(w * 0.1671, h * 0.8991, w * 0.1726, h * 0.9114, w * 0.1836, h * 0.9481);
	c.curveTo(w * 0.1946, h * 0.9849, w * 0.2, h, w * 0.2, h);
	c.stroke();

	//head right
	c.begin();
	c.moveTo(w * 0.5, h * 0.6721);
	c.curveTo(w * 0.6109, h * 0.6721, w * 0.69, h * 0.5648, w * 0.69, h * 0.3962);
	c.curveTo(w * 0.69, h * 0.3656, w * 0.6988, h * 0.3473, w * 0.6949, h * 0.3227);
	c.curveTo(w * 0.6847, h * 0.2762, w * 0.6876, h * 0.2212, w * 0.668, h * 0.1939);
	c.curveTo(w * 0.646, h * 0.1633, w * 0.5618, h * 0.12, w * 0.5, h * 0.12);
	c.stroke();
	
	//right ear
	c.begin();
	c.moveTo(w * 0.6954, h * 0.3716);
	c.curveTo(w * 0.6954, h * 0.3716, w * 0.6954, h * 0.341, w * 0.7174, h * 0.3594);
	c.curveTo(w * 0.7394, h * 0.3778, w * 0.7339, h * 0.4452, w * 0.734, h * 0.4452);
	c.quadTo(w * 0.7285, h * 0.4942, w * 0.723, h * 0.5065);
	c.curveTo(w * 0.7175, h * 0.5187, w * 0.723, h * 0.5187, w * 0.7065, h * 0.5371);
	c.curveTo(w * 0.69, h * 0.5554, w * 0.6625, h * 0.5615, w * 0.6625, h * 0.5616);
	c.stroke();

	// right shoulder
	c.begin();
	c.moveTo(w * 0.6171, h * 0.6213);
	c.curveTo(w * 0.6171, h * 0.6213, w * 0.595, h * 0.7704, w * 0.7079, h * 0.7888);
	c.curveTo(w * 0.7464, h * 0.795, w * 0.8672, h * 0.85, w * 0.8948, h * 0.8745);
	c.curveTo(w * 0.9224, h * 0.899, w * 0.9359, h * 0.9316, w * 0.9429, h * 0.9622);
	c.quadTo(w * 0.95, h, w * 0.95, h);
	c.stroke();

	// right hairline
	c.begin();
	c.moveTo(w * 0.6573, h * 0.4185);
	c.curveTo(w * 0.6573, h * 0.4185, w * 0.6573, h * 0.3839, w * 0.6573, h * 0.3593);
	c.curveTo(w * 0.6573, h * 0.3348, w * 0.6337, h * 0.3103, w * 0.6282, h * 0.3041);
	c.curveTo(w * 0.6227, h * 0.298, w * 0.6178, h * 0.2673, w * 0.6123, h * 0.2551);
	c.curveTo(w * 0.6068, h * 0.2429, w * 0.5905, h * 0.2429, w * 0.5741, h * 0.2367);
	c.curveTo(w * 0.5576, h * 0.2306, w * 0.5016, h * 0.2357, w * 0.5016, h * 0.2357);
	c.stroke();

	//shirt, right
	c.begin();
	c.moveTo(w * 0.635, h * 0.7427);
	c.curveTo(w * 0.635, h * 0.7427, w * 0.6228, h * 0.8076, w * 0.5714, h * 0.8224);
	c.curveTo(w * 0.5184, h * 0.8377, w * 0.4972, h * 0.8347, w * 0.4972, h * 0.8347);
	c.stroke();
	
	c.begin();
	c.moveTo(w * 0.6678, h * 0.7764);
	c.curveTo(w * 0.6678, h * 0.7764, w * 0.6444, h * 0.8386, w * 0.5962, h * 0.8684);
	c.curveTo(w * 0.5467, h * 0.8991, w * 0.4971, h * 0.8929, w * 0.4971, h * 0.8929);
	c.stroke();
	
	c.begin();
	c.moveTo(w * 0.7283, h * 0.9);
	c.lineTo(w * 0.7283, h);
	c.stroke();
	
	c.begin();
	c.moveTo(w * 0.8329, h * 0.8991);
	c.curveTo(w * 0.8329, h * 0.8991, w * 0.8274, h * 0.9114, w * 0.8164, h * 0.9481);
	c.curveTo(w * 0.8054, h * 0.9849, w * 0.8, h, w * 0.8, h);
	c.stroke();
	
	c.setStrokeColor(frameColor);
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();	
	c.stroke();
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_USER_MALE] = mxShapeMockupUserMale;

//**********************************************************************************************************************************************************
//User, Female
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeMockupUserFemale(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupUserFemale, mxShape);

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeMockupUserFemale.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var bgColor = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, '#ffffff');
	var frameColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#666666');
	var insideColor = mxUtils.getValue(this.style, mxMockupC.STYLE_STROKECOLOR2, '#008cff');
	c.translate(x, y);
	this.background(c, x, y, w, h, bgColor, frameColor);
	c.setShadow(false);
	this.otherShapes(c, x, y, w, h, insideColor, frameColor);
};

mxShapeMockupUserFemale.prototype.background = function(c, x, y, w, h, bgColor, frameColor)
{
	c.setFillColor(bgColor);
	c.setStrokeColor(frameColor);
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();	
	c.fillAndStroke();
};

mxShapeMockupUserFemale.prototype.otherShapes = function(c, x, y, w, h, insideColor, frameColor)
{
	//head left
	c.setStrokeColor(insideColor);
	c.setLineCap('round');
	c.setLineJoin('round');
	c.begin();
	c.moveTo(w * 0.3148, h * 0.468);
	c.curveTo(w * 0.3045, h * 0.3195, w * 0.3176, h * 0.2383, w * 0.3302, h * 0.2069);
	c.curveTo(w * 0.3508, h * 0.1557, w * 0.44, h * 0.1156, w * 0.5026, h * 0.1156);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.5029, h * 0.6728);
	c.curveTo(w * 0.4616, h * 0.6728, w * 0.4018, h * 0.6177, w * 0.3663, h * 0.5653);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.3108, h * 0.4021);
	c.curveTo(w * 0.3108, h * 0.4021, w * 0.3091, h * 0.3765, w * 0.2891, h * 0.3933);
	c.curveTo(w * 0.2691, h * 0.4101, w * 0.2782, h * 0.4661, w * 0.2782, h * 0.4661);
	c.quadTo(w * 0.2862, h * 0.5067, w * 0.2922, h * 0.5166);
	c.curveTo(w * 0.2982, h * 0.5265, w * 0.2929, h * 0.5268, w * 0.3097, h * 0.5412);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.4038, h * 0.6176);
	c.curveTo(w * 0.4038, h * 0.6176, w * 0.4324, h * 0.7778, w * 0.3375, h * 0.7963);
	c.curveTo(w * 0.3054, h * 0.8026, w * 0.1753, h * 0.8578, w * 0.15, h * 0.8826);
	c.curveTo(w * 0.1247, h * 0.9074, w * 0.1126, h * 0.9412, w * 0.1063, h * 0.9722);
	c.curveTo(w * 0.10, h * 1.0032, w * 0.1, h, w * 0.1, h);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.6377, h * 0.3365);
	c.curveTo(w * 0.5927, h * 0.2634, w * 0.5206, h * 0.2634, w * 0.5206, h * 0.2634);
	c.quadTo(w * 0.3769, h * 0.2591, w * 0.3713, h * 0.2659);
	c.curveTo(w * 0.3657, h * 0.2727, w * 0.3405, h * 0.3674, w * 0.3405, h * 0.3946);
	c.curveTo(w * 0.3405, h * 0.4218, w * 0.3405, h * 0.4602, w * 0.3405, h * 0.4602);
	c.quadTo(w * 0.3546, h * 0.6401, w * 0.3546, h * 0.6626);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.2931, h * 0.818);
	c.curveTo(w * 0.2931, h * 0.818, w * 0.3224, h * 0.9159, w * 0.3826, h * 0.9677);
	c.curveTo(w * 0.4446, h * 1.01, w * 0.5065, h, w * 0.5065, h);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.2995, h * 0.9106);
	c.lineTo(w * 0.2995, h);
	c.stroke();
	
	c.begin();
	c.moveTo(w * 0.2081, h * 0.907);
	c.curveTo(w * 0.2081, h * 0.907, w * 0.2131, h * 0.9194, w * 0.2232, h * 0.9565);
	c.curveTo(w * 0.2333, h * 0.9936, w * 0.24, h, w * 0.24, h);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.6951, h * 0.4988);
	c.curveTo(w * 0.6951, h * 0.4662, w * 0.7042, h * 0.3453, w * 0.7, h * 0.32);
	c.curveTo(w * 0.6923, h * 0.273, w * 0.6926, h * 0.2175, w * 0.6727, h * 0.19);
	c.curveTo(w * 0.6504, h * 0.159, w * 0.5651, h * 0.1157, w * 0.5025, h * 0.1157);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.5029, h * 0.6728);
	c.curveTo(w * 0.5546, h * 0.6728, w * 0.6107, h * 0.6316, w * 0.6461, h * 0.5602);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.696, h * 0.4022);
	c.curveTo(w * 0.696, h * 0.4022, w * 0.6983, h * 0.3766, w * 0.7179, h * 0.4106);
	c.curveTo(w * 0.7375, h * 0.4278, w * 0.7273, h * 0.4836, w * 0.7273, h * 0.4836);
	c.quadTo(w * 0.7184, h * 0.5241, w * 0.7123, h * 0.5338);
	c.curveTo(w * 0.7062, h * 0.5436, w * 0.7114, h * 0.544, w * 0.6943, h * 0.558);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.5995, h * 0.6278);
	c.curveTo(w * 0.5995, h * 0.6278, w * 0.5724, h * 0.7777, w * 0.6663, h * 0.7963);
	c.curveTo(w * 0.6984, h * 0.8026, w * 0.8386, h * 0.8578, w * 0.8638, h * 0.8826);
	c.curveTo(w * 0.8891, h * 0.9074, w * 0.9016, h * 0.9412, w * 0.9079, h * 0.9722);
	c.curveTo(w * 0.9142, h * 1.0032, w * 0.91, h, w * 0.91, h);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.6545, h * 0.6802);
	c.lineTo(w * 0.6545, h * 0.3986);
	c.stroke();
	
	c.begin();
	c.moveTo(w * 0.7132, h * 0.8078);
	c.curveTo(w * 0.7132, h * 0.8078, w * 0.6839, h * 0.916, w * 0.6237, h * 0.9678);
	c.curveTo(w * 0.5617, h * 1.01, w * 0.4998, h, w * 0.4998, h);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.7111, h * 0.9106);
	c.lineTo(w * 0.7111, h);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.8075, h * 0.907);
	c.curveTo(w * 0.8075, h * 0.907, w * 0.8025, h * 0.9194, w * 0.7924, h * 0.9565);
	c.curveTo(w * 0.7823, h * 0.9936, w * 0.775, h, w * 0.775, h);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.3148, h * 0.5448);
	c.curveTo(w * 0.3148, h * 0.5448, w * 0.32, h * 0.6216, w * 0.3148, h * 0.6677);
	c.quadTo(w * 0.2891, h * 0.7343, w * 0.2891, h * 0.7343);
	c.lineTo(w * 0.3303, h * 0.7625);
	c.lineTo(w * 0.39, h * 0.7625);
	c.stroke();

	c.begin();
	c.moveTo(w * 0.6852, h * 0.5448);
	c.curveTo(w * 0.6852, h * 0.5448, w * 0.68, h * 0.6216, w * 0.6852, h * 0.6677);
	c.quadTo(w * 0.7109, h * 0.7343, w * 0.7109, h * 0.7343);
	c.lineTo(w * 0.6697, h * 0.7625);
	c.lineTo(w * 0.62, h * 0.7625);
	c.stroke();
	
	c.setStrokeColor(frameColor);
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();	
	c.stroke();
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_USER_FEMALE] = mxShapeMockupUserFemale;