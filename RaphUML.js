var RaphUML = function() {

    var ClassDiagram = function() {

        this.classes = [];

        this.bodyFontSize = 12;
        this.bodyHPad = 2;
        this.bodyVPad = 2;
        this.defaultWidth = 120;
        this.headingFontSize = 12;
        this.headingVPad = 4;
    }

    ClassDiagram.prototype.class = function (name, x, y) {
        var class = new Class(this, name, x, y);
        this.classes.push(class);
        return class;
    }

    ClassDiagram.prototype.draw = function(paper) {
        for (var i = 0; i < this.classes.length; i++) {
            this.classes[i].draw(paper);
        }
    }

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


    Class.prototype.draw = function(paper) {
        
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

        paper.rect(this.x, this.y, this.width, this.height);
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




