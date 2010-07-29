
module ('Class.toString');

test('Empty Class', function () {
    var c = RaphUML.classDiagram().class('Foo');
    equals(c.toString(), 'class Foo\n');
});

test('One Property', function () {
    var c = RaphUML.classDiagram().class('Foo');
    c.property('x', 10);
    equals(c.toString(), 'class Foo\n( x=10 )\n');
});

test('Two Properties', function () {
    var c = RaphUML.classDiagram().class('Foo');
    c.property('x', 10);
    c.property('y', 20);
    equals(c.toString(), 'class Foo\n( x=10, y=20 )\n');
});

test('Two Properties - Reverse Order', function () {
    var c = RaphUML.classDiagram().class('Foo');
    c.property('y', 20);
    c.property('x', 10);
    equals(c.toString(), 'class Foo\n( y=20, x=10 )\n');
});

test('One Attribute', function () {
    var c = RaphUML.classDiagram().class('Foo');
    c.attribute('+id: int');
    equals(c.toString(), 'class Foo\n--\n+id: int\n');
});

test('Two Attributes', function () {
    var c = RaphUML.classDiagram().class('Foo');
    c.attribute('+id: int');
    c.attribute('+name: String');
    equals(c.toString(), 'class Foo\n--\n+id: int\n+name: String\n');
});

test('Attributes and Properties', function () {
    var c = RaphUML.classDiagram().class('Foo');
    c.property('x', 10);
    c.attribute('+id: int');
    equals(c.toString(), 'class Foo\n( x=10 )\n--\n+id: int\n');
});

test('One Operation', function () {
    var c = RaphUML.classDiagram().class('Foo');
    c.operation('+foo()');
    equals(c.toString(), 'class Foo\n--\n--\n+foo()\n');
});

test('Two Operations', function () {
    var c = RaphUML.classDiagram().class('Foo');
    c.operation('+foo()');
    c.operation('+bar()');
    equals(c.toString(), 'class Foo\n--\n--\n+foo()\n+bar()\n');
});

test('Bit of Everything', function () {
    var c = RaphUML.classDiagram().class('Foo');
    c.property('x', 10);
    c.attribute('+id: int');
    c.operation('+foo()');
    equals(c.toString(), 'class Foo\n( x=10 )\n--\n+id: int\n--\n+foo()\n');
});

module ('Association.toString');

test('No Multis', function () {
    var a = RaphUML.classDiagram().associationFrom('Foo').to('Bar');
    equals(a.toString(), 'assoc Foo to Bar\n');
});

test('From Multi', function () {
    var a = RaphUML.classDiagram().associationFrom('Foo', '1').to('Bar');
    equals(a.toString(), 'assoc Foo(1) to Bar\n');
});

test('To Multi', function () {
    var a = RaphUML.classDiagram().associationFrom('Foo').to('Bar', '0..*');
    equals(a.toString(), 'assoc Foo to Bar(0..*)\n');
});

test('From/To Multi', function () {
    var a = RaphUML.classDiagram().associationFrom('Foo', '1').to('Bar', '0..*');
    equals(a.toString(), 'assoc Foo(1) to Bar(0..*)\n');
});

test('With Type', function () {
    var a = RaphUML.classDiagram().associationFrom('Foo').to('Bar', null, 'nav-to');
    equals(a.toString(), 'assoc Foo nav-to Bar\n');
});


module ('ClassDiagram.toString');

test('Empty', function () {
    var cd = RaphUML.classDiagram();
    equals(cd.toString(), '');
});

test('Lots', function () {
    var cd = RaphUML.classDiagram();
    cd.class('Foo');
    cd.class('Bar');
    cd.associationFrom('Foo').to('Bar');
    equals(cd.toString(), 'class Foo\n\nclass Bar\n\nassoc Foo to Bar\n\n');
});


