jQuery.fn.selectRange = function (selStart, selEnd) { 

    selEnd = selEnd || selStart;

    return this.each(function () {
        if (this.setSelectionRange) { 
            alert('setSelectionRange');
            this.focus(); 
            this.setSelectionRange(selStart, selEnd); 
        } else if (this.createTextRange) { 
            alert('createTextRange');
            var range = this.createTextRange(); 
            range.collapse(true); 
            range.moveEnd('character', selEnd); 
            range.moveStart('character', selStart); 
            range.select(); 
        } else {
            alert('neither');
        } 
    });
}
