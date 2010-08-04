
var paper;
var line;
var path;

var log = function (message) {
    $('#results').append('<li>' + message + '</li>');
}

var redrawLines = function (startTime, iterations) {
    
    if (line) {
        line.remove();
    }

    var y0 = Math.random() * 80 + 10;
    var y1 = Math.random() * 80 + 10;
    
    //line = paper.path('M10 ' + y0 + 'L90 ' + y1);
    line = paper.path([['M', 10, y0], ['L', 90, y1]]);

    if (iterations > 0) {
        window.setTimeout('redrawLines(' + startTime + ', ' + (iterations-1) + ')', 10);
    } else {
        log('redrawLines took ' + (new Date().getTime() - startTime) + 'ms');
        line.remove();
        moveLines(new Date().getTime(), 100);
    }
}

var moveLines = function (startTime, iterations) {

    var y0 = Math.random() * 80 + 10;
    var y1 = Math.random() * 80 + 10;
    
    if (path) {
        path[0][2] = y0;
        path[1][2] = y1;
        line.attr({ path: path });
    } else {
        path = [['M', 10, y0], ['L', 90, y1]];
        line = paper.path(path);
    }

    if (iterations > 0) {
        window.setTimeout('moveLines(' + startTime + ', ' + (iterations-1) + ')', 10);
    } else {
        log('moveLines took ' + (new Date().getTime() - startTime) + 'ms');
    }
}


$(function () {
    paper = Raphael("test-area", 100, 100);
    redrawLines(new Date().getTime(), 100);
});
