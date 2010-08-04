
var classDiagram;
var paper;

var setError = function (message) {
    if (message) {
        $('#errorMessage').text(message.toString()).addClass('errorMessageActive');
    } else {
        $('#errorMessage').text('').removeClass('errorMessageActive');
    }
};

/**
 * Called when the user drags a class diagram and drops it in a different
 * location.
 */
var onChange = function () {
    $('#script').val(classDiagram.toString());
    reDraw();
}

var reDraw = function () {
    try {
        setError();
        paper.clear();
        paper.setSize($('#diagram').innerWidth(), $('#diagram').innerHeight());
        classDiagram = RaphUML.parseClassDiagram($('#script').val());
        classDiagram.draw(paper, { draggable: true, onChange: onChange });
    } catch (e) {
        if (e.offset) {
            setError('Error at offset ' + e.offset + ': ' + e.message);
            $('#script').selectRange(e.offset);
        } else {
            setError(e);
        }
    }
};


jQuery.fn.caretPosition = function() {

    if (this.size() < 1) {
        return -1;
    } else {

        var el = this.get(0);
        var pos = -1;

        if (document.selection) {
            el.focus();
            var sel = document.selection.createRange();
            sel.moveStart('character', -el.value.length);
            pos = sel.text.length;
        } else if (el.selectionStart || el.selectionStart == '0') {
            pos = el.selectionStart;
        }

        return pos;
    }
};

jQuery.fn.incrementNumberUnderCaret = function (amount) {
    return this.each(function () {
        var self = $(this);
        var pos = self.caretPosition();
        var s = self.val();
        if (pos > -1) {
            var start = pos;
            while (start > 0 && s[start - 1] >= '0' && s[start - 1] <= '9') {
                start--;
            }

            var end = pos;
            while (end < s.length && s[end] >= '0' && s[end] <= '9') {
                end++;
            }

            if (start != end) {
                var number = Math.max(Number(s.substring(start, end)) + amount, 0);
                self.val(s.substring(0, start) + number + s.substring(end));
                self.selectRange(start, end);
            }
        }
    });
};

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
};

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

    $('#script').keypress(function (e) {
        if (e.keyCode == 13 && e.ctrlKey) {
            reDraw();
            e.preventDefault();
        } else if (e.keyCode == 38 && e.ctrlKey) {
            var amount = 10;
            if (e.shiftKey) {
                amount = 1;
            }
            $(this).incrementNumberUnderCaret(amount);
            reDraw();
            e.preventDefault();
        } else if (e.keyCode == 40 && e.ctrlKey) {
            var amount = -10;
            if (e.shiftKey) {
                amount = -1;
            }
            $(this).incrementNumberUnderCaret(amount);
            reDraw();
            e.preventDefault();
        }

    });

    paper = Raphael('diagram', $('#diagram').innerWidth(), $('#diagram').innerHeight());
    reDraw();

});

