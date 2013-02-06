/**
 * $Id: mxMockupMarkup.js,v 1.1 2013-01-16 16:06:57 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Horizontal Curly Brace
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupHorCurlyBrace(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupHorCurlyBrace, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupHorCurlyBrace.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	this.background(c, x, y, w, h);
};

mxShapeMockupHorCurlyBrace.prototype.background = function(c, x, y, w, h)
{
	var midY = h * 0.5;
	var rSize = Math.min(w * 0.125, midY);
	c.begin();
	c.moveTo(0, midY + rSize);
	c.arcTo(rSize, rSize, 0, 0, 1, rSize, midY);
	c.lineTo(w * 0.5 - rSize, midY);
	c.arcTo(rSize, rSize, 0, 0, 0, w * 0.5, midY - rSize);
	c.arcTo(rSize, rSize, 0, 0, 0, w * 0.5 + rSize, midY);
	c.lineTo(w - rSize, midY);
	c.arcTo(rSize, rSize, 0, 0, 1, w, midY + rSize);
	c.stroke();
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_HOR_CURLY_BRACE] = mxShapeMockupHorCurlyBrace;/**
 * $Id: mxMockupMarkup.js,v 1.1 2013-01-16 16:06:57 gaudenz Exp $
 * Copyright (c) 2006-2010, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Vertical Curly Brace
//**********************************************************************************************************************************************************
/**
 * Extends mxShape.
 */
function mxShapeMockupVerCurlyBrace(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeMockupVerCurlyBrace, mxShape);

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShapeMockupVerCurlyBrace.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	this.background(c, x, y, w, h);
};

mxShapeMockupVerCurlyBrace.prototype.background = function(c, x, y, w, h)
{
//	var midX = w * 0.5;
//	var rSize = Math.min(h * 0.125, midX);
//	c.begin();
//	c.moveTo(0, midX + rSize);
//	c.arcTo(rSize, rSize, 0, 0, 1, rSize, midY);
//	c.lineTo(w * 0.5 - rSize, midY);
//	c.arcTo(rSize, rSize, 0, 0, 0, w * 0.5, midY - rSize);
//	c.arcTo(rSize, rSize, 0, 0, 0, w * 0.5 + rSize, midY);
//	c.lineTo(w - rSize, midY);
//	c.arcTo(rSize, rSize, 0, 0, 1, w, midY + rSize);
//	c.stroke();
};

mxCellRenderer.prototype.defaultShapes[mxMockupC.SHAPE_HOR_CURLY_BRACE] = mxShapeMockupVerCurlyBrace;