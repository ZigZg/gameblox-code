goog.provide('bd.columnEdit.ctr');

bd.columnEdit.ctr.movedEntityId = null;
bd.columnEdit.ctr.options = [["Text","String"],["Number","Number"]];

bd.columnEdit.ctr.setup = function(callbackFunction) {
  bd.columnEdit.ctr.setColumnList();
};

//makes a new column
bd.columnEdit.ctr.addColumn = function(){
  var id = bd.editor.ctr.getSelectedEntity().id
  var entity = new bd.component.tableColumn.constructor(null, id, "", bd.columnEdit.ctr.options[0][1])
  bd.columnEdit.ctr.addColumnBox(entity,id)
};


//makes a new column drag-and-drop box in the "make column" overlay
bd.columnEdit.ctr.addColumnBox = function(entity,tableClassId){
  //var columnEditorContainer = document.getElementById("columnEditorOverlay");
  var columnContainer = document.getElementById("filepickerColumnList");
  var colItem = document.createElement("li")
  colItem.className = "filepicker-column-item"
  colItem.style.width = "200px"
  colItem.style.borderStyle = "solid";
  colItem.style.borderWidth = "5px";
  colItem.style.marginTop = "2px";
  colItem.style.marginBottom = "3px";
  //colItem.style.marginLeft = "auto";
  //colItem.style.marginRight = "auto";
  colItem.setAttribute("data-columnId",entity.model.id);

  var col = document.createElement("div")
  col.className = "filepicker-column"
  col.id = "filepickerColumnBox"+(bd.component.lookup(tableClassId).model.columnIds.length-1)

  var colName = document.createElement("input");
  colName.className = "filepicker-column-name";
  colName.style.width = "100px";
  colName.value = entity.model.columnName
  bd.util.setTextInputChangeEventHandlers(colName,{entityId:entity.model.id,propertyName:"columnName",updateInstances:false},null,bd.sideBar.ctr.textUpdateSuccess,null);
  col.appendChild(colName)

  var colType = document.createElement("select");
  colType.className = "filepicker-column-type";
  for(i=0;i<bd.columnEdit.ctr.options.length;i++){
  	opt = document.createElement("option");
  	colType.options.add(opt);
  	opt.text = bd.columnEdit.ctr.options[i][0];
  	opt.value = bd.columnEdit.ctr.options[i][1];
  }
  if(entity.model.columnType!=bd.columnEdit.ctr.options[0][1]){
    colType.value = entity.model.columnType;
  }
  bd.util.setupDropDownChangeEventHandlers(colType,{entityId:entity.model.id,propertyName:"columnType",updateInstances:false},null,bd.sideBar.ctr.dropDownUpdateSuccess,null);
  col.appendChild(colType)

  var breakText = document.createElement('br');
  col.appendChild(breakText)

  var colDelete = document.createElement("div");
  colDelete.className = "filepicker-delete-column-container";

  var deleteButton = document.createElement("a");
  deleteButton.className = "filepicker-delete-column";
  deleteButton.href = "#";
  deleteButton.onclick = function(){bd.columnEdit.ctr.deleteColumn(entity.model.id);};
  deleteButton.innerText = "Delete"
  colDelete.appendChild(deleteButton)
  col.appendChild(colDelete)

  colItem.appendChild(col)
  columnContainer.appendChild(colItem)
};

bd.columnEdit.ctr.setColumnList = function(){
  var columnContainer = document.getElementById("filepickerColumnList");
  columnContainer.innerHTML = '';

  var tableClass = bd.component.lookup(bd.editor.ctr.getSelectedEntity().id)
  for(j=0;j<tableClass.model.columnIds.length;j++){
    var column = bd.component.lookup(tableClass.model.columnIds[j])
    bd.columnEdit.ctr.addColumnBox(column,tableClass.id)
  }
};


bd.columnEdit.ctr.reorderColumns = function(){
  var columns = document.getElementsByClassName("filepicker-column-item");
  var columnArray = bd.editor.ctr.getSelectedEntity().columnIds;
  var oldIndex;
  for(i=0;i<columnArray.length;i++){
  	if(columnArray[i]==bd.columnEdit.ctr.movedEntityId){
  		oldIndex = i
  	}
  }
  var newIndex;
  for(i=0;i<columns.length;i++){
  	if(parseInt(columns[i].getAttribute("data-columnId"))==bd.columnEdit.ctr.movedEntityId){
  		newIndex = i
  	}
  }
  columnArray.splice(oldIndex,1)
  columnArray.splice(newIndex,0,bd.columnEdit.ctr.movedEntityId)
};

bd.columnEdit.ctr.deleteColumn = function(id){
  var columnContainer = document.getElementById("filepickerColumnList");
  var columnBoxes = columnContainer.getElementsByClassName("filepicker-column-item")
  var index;
  for(i=0;i<columnBoxes.length;i++){
    if(columnBoxes[i].getAttribute("data-columnId")==id){
      index = i;
    }
  }

  if (confirm("Are you sure you want to permanently delete this column?")) {
  	var columnArray = bd.editor.ctr.getSelectedEntity().columnIds;
	  //try-catch because entity may not be deletable if referenced in the blocks
	  try {
	    bd.component.lookup(id).deleteEntity()
      columnArray.splice(index,1)
	  } catch (e) {
	    if(e.type == "CannotDeleteEntityError"){
		    alert(e.getDeleteErrorString());
	    } else {
		    throw e;
	    }
	  }

	//Delete columnId
	bd.columnEdit.ctr.setColumnList();
  }
};

jQuery(document).ready(function(){
  jQuery("#filepickerColumnList").sortable({
    stop: function(e, obj) {
      //New order is fine, just need to switch order of columnId's
	    bd.columnEdit.ctr.movedEntityId = parseInt(obj.item[0].getAttribute('data-columnId'));
      bd.columnEdit.ctr.reorderColumns();
    }
  });
});

//register columnEditor as an overlay
new bd.overlay.ctr.overlayPanel("columnEditor",bd.columnEdit.ctr.setup);

