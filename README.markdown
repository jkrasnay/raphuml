RaphUML is a JavaScript library for drawing UML diagrams in the browser
using the Raphael graphics library. The idea is to be able to specify
UML class and sequence diagrams in HTML using simple DSLs and have them
nicely rendered using vector graphics. For example, a class diagram
might be implemented like this:

    <pre id="myClasses">

      class Foo
      --
      +id: int
      +name: String

      class Bar
      --
      +id: int

      assoc Foo(1) to Bar(1..*)

    </pre>

    <script>
      $(function () { $('#myClasses').classDiagram(); }
    </script>

The DSL for sequence diagrams will be similar to that used by [Web
Sequence Diagrams](http://www.websequencediagrams.com), which would look
something like this:

    <pre id="mySeq">
      participant foo "Foo"
      participant bar "Bar"
      foo -> bar
    </pre>

# Status/TODO

RaphUML can currently render class diagrams built programmatically by
the Javascript API. Classes must be explicitly positioned on the
diagram. I hope to implement a layout algorithm that will position the
classes nicely by default.

The class diagram parser is mostly working, but I'll need to add the
facility for arbitrary properties to be specified, so that we can
position the classes until I get the layout algorithm specified.

Next steps:

- implement class properties in the parser
- implement a function and JQuery plug-in to automatically convert <pre>
  elements containing the DSL to a class diagram
- parse and draw class operations
- implement an automated layout algorithm
- work on sequence diagrams

# Build and Test

Building RaphUML involves generating the parser from the parser
definition (`*.par`) files, then assembling RaphUML from the generated
parsers and other Javascript files. To do this you need the following:

- Java
- [Ant](http://ant.apache.org/), a Java-based build utility
- [Rhino](http://www.mozilla.org/rhino/), a Javascript interpreter. This
  is used to run JS/CC in order to generate the DSL parsers.
- [JS/CC](http://jscc.jmksf.com/), a parser generator in Javascript

The first three can be installed in Ubuntu with `sudo apt-get install
ant rhino`. For other operating systems you're on your own.

Once installed, ensure that the `ant` executable is on your path. The
build script assumes that the Rhino executable is available at
`/usr/bin/rhino`, and that JS/CC is available at `/opt/jscc`. If this
the the case for you, simply change into the RaphUML directory and run
`ant`. If not, you'll need to specify the locations of these utilities
on the command line like so:

    ant -Drhino=/path/to/rhino -Djscc=/path/to/jscc-dir

This should create `target/RaphUML.js`.

To test, load the desired HTML file from the `test` directory into your
browser.
