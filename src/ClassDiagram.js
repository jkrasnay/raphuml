/*
 * ClassDiagram.js
 *
 *
 * The MIT License
 *
 * Copyright (c) 2010 John Krasnay
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* straightLineRouter
 *
 * The default router function for class diagrams. The router
 * function is responsible for drawing paths representing all
 * assocations on a diagram.
 */
var straightLineRouter = function(paper, classDiagram) {

    var boxIntersection = function (thisClass, otherClass) {

        var seg = [ thisClass.cx(), thisClass.cy(), otherClass.cx(), otherClass.cy() ];

        var c = thisClass;
        var sides = {
            top: [ c.x, c.y, c.x + c.width, c.y ],
            right: [ c.x + c.width, c.y, c.x + c.width, c.y + c.height],
            bottom: [ c.x, c.y + c.height, c.x + c.width, c.y + c.height],
            left: [ c.x, c.y, c.x, c.y + c.height ]
        };

        for (var side in sides) {
            var intersect = seg_intersect(seg, sides[side]);
            if (intersect) {
                console.log('found intersection at ' + side);
                return { side: side, point: intersect }
            }
        }

        console.error('Found no side');

        return null;
    }


    var drawMulti = function (paper, multi, thisInt, otherInt) {
        var anchor;
        if (thisInt.side == 'top') {
            anchor = 7;
        } else if (thisInt.side == 'right') {
            anchor = 1;
        } else if (thisInt.side == 'bottom') {
            anchor = 1;
        } else {
            anchor = 3;
        }

        paper.text(0, 0, multi).anchor(anchor, thisInt.point[0], thisInt.point[1]);

    }

    for (var i = 0; i < classDiagram.associations.length; i++) {

        var a = classDiagram.associations[i];

        var int1 = boxIntersection(a.fromClass, a.toClass);
        var int2 = boxIntersection(a.toClass, a.fromClass);

        if (int1 && int2) {

            paper.path('M' + int1.point[0] + ' ' + int1.point[1] +
                    'L' + int2.point[0] + ' ' + int2.point[1]);


            drawMulti(paper, a.fromCardinality, int1, int2);
            drawMulti(paper, a.toCardinality, int2, int1);

            var mx = (a.fromClass.cx() + a.toClass.cx()) / 2;
            var my = (a.fromClass.cy() + a.toClass.cy()) / 2;

            if (a.name) {
                paper.text(0, 0, a.name).anchor(8, mx, my);
            }
        }
    }
}



/* ClassDiagram
 *
 * Instances of ClassDiagram are responsible for drawing a class diagram.
 * They keep track of lists of Class and Association objects, and parameters
 * to control the drawing operation.
 *
 * The `router` member points to a function that
 */
var ClassDiagram = function() {

    this.associations = [];
    this.classes = [];

    this.bodyFontSize = 12;
    this.bodyHPad = 2;
    this.bodyVPad = 2;
    this.defaultWidth = 120;
    this.headingFontSize = 12;
    this.headingVPad = 4;
    this.router = straightLineRouter;
}

ClassDiagram.prototype.associationFrom = function (class, cardinality) {
    var assoc = new Association();
    assoc.fromClass = class;
    assoc.fromCardinality = cardinality;
    this.associations.push(assoc);
    return assoc;
}

ClassDiagram.prototype.class = function (name, x, y) {
    var class = new Class(this, name, x, y);
    this.classes.push(class);
    return class;
}

ClassDiagram.prototype.draw = function(paper) {
    this.router(paper, this);
    for (var i = 0; i < this.classes.length; i++) {
        this.classes[i].draw(paper);
    }
}




/* Parses and returns a class diagram, using our class diagram DSL.
 * If there's a syntax error, throws an object with the attributes
 * 'message' containing the error message and 'offset' containing
 * the character offset at which the error occurred.
 *
 * s - String representing the class diagram to parse, in our class
 *     diagram DSL.
 */
ClassDiagram.parse = function (s) {

    var err_off = [];
    var err_la = [];

    parsedClassDiagram = RaphUML.classDiagram();

    var err_cnt = __ClassDiagram_parse(s, err_off, err_la);

    if (err_cnt > 0) {
        throw { offset: err_off[0], message: 'Expected one of: ' + err_la[0] };
    } else {
        return parsedClassDiagram;
    }
}




/* Association
 *
 * Instances of this class represent associations between two
 * classes. Associations do not draw themselves; instead, the class
 * diagram is fitted with a router function that draws all the
 * associations on the diagram with a particular algorithm.
 */
var Association = function() {
}

Association.prototype.name = function (name) {
    this.name = name;
    return this;
}

Association.prototype.to = function (class, cardinality) {
    this.toClass = class;
    this.toCardinality = cardinality;
    return this;
}



/* Class
 *
 * Instances of this class represent classes in the subject domain.
 * Each instance draws itself via the draw method.
 */
var Class = function(classDiagram, name, x, y) {
    this.classDiagram = classDiagram;
    this.name = name;
    this.x = x || 0;
    this.y = y || 0;
    this.width = classDiagram.defaultWidth;
    this.height = classDiagram.headingFontSize + 2 * classDiagram.headingVPad;

    this.attributes = [];
}

Class.prototype.attribute = function (attributeString) {

    this.attributes.push(new Attribute(this, attributeString));

    if (this.attributes.length == 1) {
        this.height += this.classDiagram.bodyVPad;
    }

    this.height += this.classDiagram.bodyFontSize + this.classDiagram.bodyVPad;

    return this;
}

Class.prototype.cx = function() {
    return this.x + this.width / 2;
}

Class.prototype.cy = function() {
    return this.y + this.height / 2;
}

Class.prototype.draw = function(paper) {

    paper.rect(this.x, this.y, this.width, this.height).attr({ fill: 'white' });

    var text = paper.text(0, 0, this.name).attr({
        'font-weight': 'bold',
        'font-size': this.classDiagram.headingFontSize,
        x: this.x + this.width/2,
        y: this.y + this.classDiagram.headingVPad + this.classDiagram.headingFontSize/2
    });

    if (this.attributes.length > 0) {
        var y = this.y + this.classDiagram.headingFontSize + 2 * this.classDiagram.headingVPad;
        paper.path('M' + this.x + ' ' + y + 'L' + (this.x + this.width) + ' ' + y);
    }

    var x = this.x + this.classDiagram.bodyHPad;
    y += this.classDiagram.bodyVPad + this.classDiagram.bodyFontSize / 2;
    for (var i = 0; i < this.attributes.length; i++) {
        console.log("Drawing " + this.attributes[i].attributeString);
        var text = paper.text(x, y, this.attributes[i].attributeString);
        text.attr('x', x + text.getBBox().width / 2);
        y += this.classDiagram.bodyFontSize + this.classDiagram.bodyVPad;
    }

}


var Attribute = function(class, attributeString) {
    this.class = class;
    this.attributeString = attributeString;
}



/* seg_intersect
 *
 * Find the intersection between two line segments.
 *
 * Each arg is a line segment, represented as an array of four numbers:
 * [ x1, y1, x2, y2 ].
 *
 * If the lines intersect, returns a two-element array representing the
 * intersection point. If not, returns null.
 *
 * Algorithm from http://www.topcoder.com/tc?module=Static&d1=tutorials&d2=geometry2
 *
 */
var seg_intersect = function(seg1, seg2) {

  console.log("Testing " + seg1 + " to " + seg2);

  var a1 = seg1[3] - seg1[1];
  var b1 = seg1[0] - seg1[2];
  var c1 = a1 * seg1[0] + b1 * seg1[1];

  var a2 = seg2[3] - seg2[1];
  var b2 = seg2[0] - seg2[2];
  var c2 = a2 * seg2[0] + b2 * seg2[1];

  var det = a1 * b2 - a2 * b1;

  console.log("det is " + det);
  if (det == 0) {
    console.log("Lines are parallel");
    return null;
  } else {
    var x = (b2 * c1 - b1 * c2) / det;
    var y = (a1 * c2 - a2 * c1) / det;
    var point = [ x, y ];
    console.log("Lines meet at " + point[0] + ", " + point[1]);
    if (seg_contains(seg1, point) && seg_contains(seg2, point)) {
        console.log("...and it's inside the segment");
        return point;
    } else {
        console.log("...but it's outside the segment");
        return null;
    }

  }

};

/* seg_contains
 *
 * Returns true if the given segment contains the given point.
 *
 * seg - Line segment represented by an array of four numbers: [ x1, y1, x2, y2 ]
 * point - Point to be tested: [ x, y ]
 *
 */
var seg_contains = function(seg, point) {
  return Math.min(seg[0], seg[2]) <= point[0]
  && point[0] <= Math.max(seg[0], seg[2])
  && Math.min(seg[1], seg[3]) <= point[1]
  && point[1] <= Math.max(seg[1], seg[3]);
}

seg_intersect([ 0, 0, 4, 4 ], [ 2, 1, 3, 2 ]);
seg_intersect([ 0, 0, 4, 4 ], [ 2, 1, 1, 2 ]);
seg_intersect([ 0, 0, 4, 4 ], [ 2, 1, 3, 2.1 ]);
