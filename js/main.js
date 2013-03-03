
var fireBase = new Firebase ("https://write.firebaseio.com/");


$('#editor').on('keyup', function(e){
	if(e.keyCode === 13){
console.log("Enter Key!")
		newFirebase().set({allCode : editor.getValue()})
	} else {
	pushChange();
	}
});

$('#editor').on('mouseup', function(){
	pushChange();
});

var pushChange = function(){
	var range = editor.selection.getRange()
	var startrow = range.start.row;
    var endrow = range.end.row;
	setNewRange(startrow, endrow);
  	var selectedText = editor.getSession().getTextRange();
pushToFirebase(startrow, endrow, selectedText);
	editor.getSession().selection.setSelectionRange(range);
}
var pushToFirebase = function(startRow, endRow, text){
	nowFirebase = newFirebase();
  	nowFirebase.set({"startRow" : startRow , "endRow" : endRow ,  "range" : text});
}
var setNewRange = function(startrow, endrow){


    var selection = editor.getSession().selection

    var newRange = selection.getLineRange();
    var lineEnd = editor.session.getLine(endrow).length;
    newRange.setStart(startrow, 0);
    newRange.setEnd(endrow, lineEnd);
    selection.setSelectionRange(newRange);
    return newRange;
}
var newFirebase = function(){
	var now = new Date().getTime()
console.log(now);
	var newChild = fireBase.child(now.toString(10))
	return newChild;
}

fireBase.on('child_added', function(snapshot) {
	var content = snapshot.val();
	if(content.allCode){
		var cursor = editor.selection.getCursor()

		editor.setValue(content.allCode);

		editor.clearSelection();
		editor.moveCursorToPosition(cursor);
	} else {
		var endRow = content.endRow;
		var startRow = content.startRow;
		var text = content.range;
		updateEditor(startRow, endRow, text);
	}
	
});

var updateEditor = function(startRow, endRow, text){

	var range = editor.selection.getRange()
	var doc = editor.getSession().getDocument()
	var newRange = setNewRange(startRow, endRow);
    doc.replace(newRange, text);

	editor.getSession().selection.setSelectionRange(range);
}

fireBase.onDisconnect().remove();
