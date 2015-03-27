goog.provide('bd.tableEdit.ctr');


bd.tableEdit.ctr.setup = function(callbackFunction) {

  var tableClass = bd.component.lookup(bd.editor.ctr.getSelectedEntity().id)
  var columnHeaders = []
  for(i=0;i<tableClass.model.columnIds.length;i++){
  	var columnName = bd.component.lookup(tableClass.model.columnIds[i]).model.columnName
  	columnHeaders.push(columnName)
  }
  var sideBarEntityContainer = document.getElementById(tableClass.sideBarPanelName)
  var table = bd.component.lookup(parseInt(sideBarEntityContainer.getElementsByClassName('tableDropDown')[0].value))
  var rowData = table.model.editorRowData
  var container = document.getElementById('hot');
  container.innerHTML = "";
  var hot = new Handsontable(container,{data:rowData,
                                        minSpareRows:1,
                                        colHeaders:columnHeaders,
                                        columns:bd.tableEdit.ctr.setType(),
                                        contextMenu:['row_above','row_below','remove_row','undo','redo']});
};

bd.tableEdit.ctr.setType = function(){
  var tableClass = bd.component.lookup(bd.editor.ctr.getSelectedEntity().id)
  var columns = []
  for(i=0;i<tableClass.model.columnIds.length;i++){
  	var columnName = bd.component.lookup(tableClass.model.columnIds[i]).model.columnName
	  var columnType = bd.component.lookup(tableClass.model.columnIds[i]).model.columnType
	  if(columnType=="Number"){
		  columns.push({type:"numeric"})
	  } else {
		  columns.push({})
	  }
  }
  return columns
}

//register tableEditor as an overlay
new bd.overlay.ctr.overlayPanel("tableEditor",bd.tableEdit.ctr.setup);
