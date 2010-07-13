
test('Empty content', function () {
    var diagram = RaphUML.parseClassDiagram($('#empty').text());
    equals(diagram.classes.length, 0);
});

test('Single newline', function () {
    var diagram = RaphUML.parseClassDiagram($('#newline').text());
    equals(diagram.classes.length, 0);
});

test('Syntax error at offset zero', function () {
    try {
        var diagram = RaphUML.parseClassDiagram($('#error1').text());
    } catch (e) {
        equals(e.offset, 0);
        equals(e.message, 'Expected one of: $,n,class,assoc');
    }
});


test('Simple class', function () {
    var diagram = RaphUML.parseClassDiagram($('#simpleClass').text());
    equals(diagram.classes.length, 1);
    equals(diagram.classes[0].name, 'Foo');
});

test('Two classes', function () {
    var diagram = RaphUML.parseClassDiagram($('#twoClasses').text());
    equals(diagram.classes.length, 2);
    equals(diagram.classes[0].name, 'Foo');
    equals(diagram.classes[1].name, 'Bar');
});

test('Class with attributes', function () {
    var diagram = RaphUML.parseClassDiagram($('#classWithAttributes').text());
    equals(diagram.classes.length, 1);
    var c = diagram.classes[0];
    equals(c.name, 'Foo');
    equals(c.attributes.length, 2);
    equals(c.attributes[0].attributeString, '+id: int');
    equals(c.attributes[1].attributeString, '+name: String');
});

test('Class with properties', function () {
    var diagram = RaphUML.parseClassDiagram($('#classWithProperties').text());
    equals(diagram.classes.length, 1);
    var c = diagram.classes[0];
    equals(c.name, 'Foo');
    equals(c.x, 1);
    equals(c.y, 2);
});

