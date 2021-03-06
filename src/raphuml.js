/*
 * RaphUML.js - v@VERSION@
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

@CLASS_DIAGRAM_PARSER@
@CLASS_DIAGRAM@

    return {

        classDiagram: function () {
            return new ClassDiagram();
        },

        parseClassDiagram: function (s) {
            return ClassDiagram.parse(s);
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

    if (xPad == null) { xPad = 3; }
    if (yPad == null) { yPad = xPad; }

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


/* arrow (Raphael canvas plug-in)
 *
 * Creates an arrow object.
 *
 * x, y - Tip of the arrow.
 * x2, y2 - Other end of the line segment on which the arrow is drawn.
 *          This establishes the angle of the arrow.
 * length - Length of the arrow.
 * width - Width of the arrow.
 * closed - If true, the arrow is rendered as a closed path.
 */
Raphael.fn.arrow = function (x, y, x2, y2, length, width, closed) {

    var a = length;
    var b = width/2;

    var pathString = 'M' + x + ' ' + y + 'm' + a + ' ' + b + 'L' + x + ' ' + y + 'l' + a + ' ' + (-b);

    if (closed) {
        pathString += ' z';
    }

    var path = this.path(pathString);

    var angle = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;

    if (angle < 0) {
        angle += 360;
    }

    path.rotate(angle, x, y);

    return path;
}

/* diamond (Raphael canvas plug-in)
 *
 * Creates a diamond object positioned at the end of a line segment.
 *
 * x, y - Tip of the line segment where the arrow is to be drawn.
 * x2, y2 - Other end of the line segment on which the diamond is drawn.
 * length - Length of the diamond.
 * width - Width of the diamond.
 */
Raphael.fn.diamond = function (x, y, x2, y2, length, width) {

    var a = length/2;
    var b = width/2;

    var pathString = 'M' + x + ' ' + y + 'l' + a + ' ' + b + 'l' + a + ' ' + (-b) + 'l' + (-a) + ' ' + (-b) + 'z';

    var path = this.path(pathString);

    var angle = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;

    if (angle < 0) {
        angle += 360;
    }

    path.rotate(angle, x, y);

    return path;
}


if (jQuery) {
    (function ($) {

        /* Replaces an element containing a textual class diagram
         * with a graphical one.
         */
        jQuery.fn.classDiagram = function () {

            return this.each(function () {

                var script = $(this);
                //var offset = script.offset();

                var diagramDiv = $('<div></div>').addClass('classDiagram');

                script.after(diagramDiv);

                var paper = Raphael(diagramDiv.get(0), 10000, 10000);

                try {
                    var diagram = RaphUML.parseClassDiagram(script.text());
                    diagram.draw(paper);
                    var b = diagram.getBounds();
                    diagramDiv.css('width', b.x + b.width).css('height', b.y + b.height);
                    script.css('display', 'none');
                } catch (e) {
                    if (e.offset) {
                        diagram.text('Error at offset ' + e.offset + ': ' + e.message);
                    } else {
                        diagram.text(e);
                    }
                }


            });

        }

    })(jQuery);
}

