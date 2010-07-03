/*
 * RaphUML.js
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

var RaphUML = function () {


    /* straightLineRouter
     *
     * The default router function for class diagrams. The router
     * function is responsible for drawing paths representing all
     * assocations on a diagram.
     */
    var straightLineRouter = function(paper, classDiagram) {
        for (var i = 0; i < classDiagram.associations.length; i++) {
            var a = classDiagram.associations[i];
            paper.path('M' + a.fromClass.cx() + ' ' + a.fromClass.cy() +
                    'L' + a.toClass.cx() + ' ' + a.toClass.cy());

            var mx = (a.fromClass.cx() + a.toClass.cx()) / 2;
            var my = (a.fromClass.cy() + a.toClass.cy()) / 2;

            if (a.name) {
                paper.text(0, 0, a.name).anchor(8, mx, my);
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



    var intersect = function(seg1, seg2) {
      /* From http://www.topcoder.com/tc?module=Static&d1=tutorials&d2=geometry2 */
      /* Each arg represents a line segment with the attributes x1, y1, x2, y2 */

      console.log("Testing " + seg1 + " to " + seg2);

      var a1 = seg1.y2 - seg1.y1;
      var b1 = seg1.x1 - seg1.x2;
      var c1 = a1 * seg1.x1 + b1 * seg1.y1;

      var a2 = seg2.y2 - seg2.y1;
      var b2 = seg2.x1 - seg2.x2;
      var c2 = a2 * seg2.x1 + b2 * seg2.y1;

      var det = a1 * b2 - a2 * b1;

      console.log("det is " + det);
      if (det == 0) {
        console.log("Lines are parallel");
      } else {
        var x = (b2 * c1 - b1 * c2) / det;
        var y = (a1 * c2 - a2 * c1) / det;
        var point = { x: x, y: y };
        console.log("Lines meet at " + point.x + ", " + point.y);
        if (seg_contains(seg1, point) && seg_contains(seg2, point)) {
            console.log("...and it's inside the segment");
        } else {
            console.log("...but it's outside the segment");
        }

      }

    };

    var seg_contains = function(seg, point) {
      return Math.min(seg.x1, seg.x2) <= point.x
      && point.x <= Math.max(seg.x1, seg.x2)
      && Math.min(seg.y1, seg.y2) <= point.y
      && point.y <= Math.max(seg.y1, seg.y2);
    }

    intersect({ x1: 0, y1: 0, x2: 4, y2: 4 }, { x1: 2, y1: 1, x2: 3, y2: 2 });
    intersect({ x1: 0, y1: 0, x2: 4, y2: 4 }, { x1: 2, y1: 1, x2: 1, y2: 2 });
    intersect({ x1: 0, y1: 0, x2: 4, y2: 4 }, { x1: 2, y1: 1, x2: 3, y2: 2.1 });

    return {
        classDiagram: function () {
            return new ClassDiagram();
        }
    };

}();


/* anchor (Raphael element plug-in)
 *
 * Positions the object relative to a given anchor point. There are nine
 * anchor points, as follows:
 *
 *   1   2   3
 *   4   5   6
 *   7   8   9
 *
 * For example, for anchor point 1, the top-left corner of the element 
 * is positioned at the given anchor point coordinates.
 *
 * anchor - which anchor point to use
 * x - x-coordinate of the anchor point
 * y - y-coordinate of the anchor point
 * xPad - amount of x padding, optional, defaults to 3
 * yPad - amount of y padding, optional, defaults to the same value as the x padding
 */
Raphael.el.anchor = function (anchor, x, y, xPad, yPad) {

    xPad = xPad || 3;
    yPad = yPad || xPad;

    var box = this.getBBox();

    switch (anchor) {
        case 1:
            var cx = x + xPad + box.width / 2;
            var cy = y + yPad + box.height / 2;
            break;
        case 2:
            var cx = x;
            var cy = y + yPad + box.height / 2;
            break;
        case 3:
            var cx = x - xPad - box.width / 2;
            var cy = y + yPad + box.height / 2;
            break;
        case 4:
            var cx = x + xPad + box.width / 2;
            var cy = y;
            break;
        case 5:
            var cx = x;
            var cy = y;
            break;
        case 6:
            var cx = x - xPad - box.width / 2;
            var cy = y;
            break;
        case 7:
            var cx = x + xPad + box.width / 2;
            var cy = y - yPad - box.height / 2;
            break;
        case 8:
            var cx = x;
            var cy = y - yPad - box.height / 2;
            break;
        case 9:
            var cx = x - xPad - box.width / 2;
            var cy = y - yPad - box.height / 2;
            break;
    }

    this.attr({ x: cx, y: cy });
};



