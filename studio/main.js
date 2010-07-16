
var paper;

var setError = function (message) {
    if (message) {
        $('#errorMessage').text(message).addClass('errorMessageActive');
    } else {
        $('#errorMessage').text('').removeClass('errorMessageActive');
    }
}

var reDraw = function () {
    try {
        setError();
        paper.clear();
        paper.setSize($('#diagram').innerWidth(), $('#diagram').innerHeight());
        var classDiagram = RaphUML.parseClassDiagram($('#script').val());
        classDiagram.draw(paper);
    } catch (e) {
        if (e.offset) {
            setError('Error at offset ' + e.offset + ': ' + e.message);
            $('#script').selectRange(e.offset);
        } else {
            setError(e);
        }
    }
}

jQuery.fn.selectRange = function (selStart, selEnd) { 

    selEnd = selEnd || selStart;

    return this.each(function () {
        if (this.setSelectionRange) { 
            this.focus(); 
            this.setSelectionRange(selStart, selEnd); 
        } else if (this.createTextRange) { 
            var range = this.createTextRange(); 
            range.collapse(true); 
            range.moveEnd('character', selEnd); 
            range.moveStart('character', selStart); 
            range.select(); 
        } 
    });
}

$(function () { 

    $('body').layout();

    $('#body').layout({
        closable: false,
        resizable: false,
        spacing_open: 10,
        west__resizable: true,
        west__size: 400
    });

    $('#editor').layout({
        closable: false,
        resizable: false,
        south__size: 40
    });
    
    paper = Raphael('diagram', $('#diagram').innerWidth(), $('#diagram').innerHeight());
    reDraw(); 

});

