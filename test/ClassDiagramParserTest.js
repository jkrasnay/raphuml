load('ClassDiagramParser.js');

var err_off = [];
var err_la = [];

__ClassDiagramparse('class Foo\n', err_off, err_la);

print('err_off is ' + err_off);
print('err_la is ' + err_la);
