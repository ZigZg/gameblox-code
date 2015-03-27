goog.provide('bd.methodTag.table')

//This file contains the code for the table component's methods.
bd.methodTag.table = {
  provideMethods: function(){
    return [{name:"sortTable",fxn:bd.methodTag.table.sortTable,classOrInstance:"instance"},
            {name:"filterTable",fxn:bd.methodTag.table.filterTable,classOrInstance:"instance"},
            {name:"updateSideBar",fxn:bd.methodTag.table.updateSideBar,classOrInstance:"class"},
            {name:"removeConnections",fxn:bd.methodTag.table.removeConnections,classOrInstance:"instance"}];
  }
};

bd.methodTag.table.sortTable = function(table,column,order) {
  //finds where the column to be sorted is in columnIds
  var columnIds = bd.component.lookup(table.model.parentId).model.columnIds
  var index;
  for(i=0;i<columnIds.length;i++){
    if(columnIds[i] == column.id){
      index = i;
      break;
    }
  }

  //associates data to be sorted with its corresponding row (row id is stored)
  //and also creates an array of columnData to be sorted
  var tableRowIds = table.model.rowIds;
  var rowDataDict = [];
  var columnData = [];
  for(i=0;i<tableRowIds.length;i++){
 	  var rowData = bd.component.lookup(tableRowIds[i]).model.data[index]
 	  columnData.push(rowData)
 	  rowDataDict.push({row:tableRowIds[i],data:rowData})
  }

  //sorts the array in increasing order
  var columnType = column.model.columnType
  switch(columnType){
  	case "String":
  	  columnData.sort()
  	  break;
    case "Number":
      columnData.sort(function(a,b){return a-b});
      break;
    case "date":
      break;
    case "time":
      break;
  }

  //reverses array if order is "decreasing"
  if(order=="decreasing"){
  	columnData.reverse()
  }

  //puts row ids in order of sorted column array
  var rowIds = [];
  for(i=0;i<columnData.length;i++){
  	var columnDatum = columnData[i]
  	for(j=0;j<rowDataDict.length;j++){
  	  if(rowDataDict[j].data==columnDatum && rowIds.indexOf(rowDataDict[j].row)==-1){
  	  	rowIds.push(rowDataDict[j].row)
  	  }
  	}
  }

  return rowIds;
}

//logic_compare and logic_operation
bd.methodTag.table.filterTable = function(table,condition){
  var type = condition.type
  var rows = table.model.rowIds
  var filteredIds = []
  switch(type){
    case("num_compare"):
      var tableColumn = condition.params[0].id
      var parentTable = bd.component.lookup(table.model.parentId)
      var index;
      for(i=0;i<parentTable.model.columnIds.length;i++){
        if(parentTable.model.columnIds[i]==tableColumn){
          index = i;
          break;
        }
      }
      var operation = condition.operation
      var param2 = condition.params[1]
      for(i=0;i<rows.length;i++){
        var param1 = bd.component.lookup(rows[i]).model.data[index]
        var bool = bd.evaluator.ctr.configs["logic_compare"].conditionEval(operation,param1,param2)
        if(bool){
          filteredIds.push(rows[i])
        }
      }
      break;
    case("and"):
      var condition1 = condition.params[0]
      var condition2 = condition.params[1]
      //filters the table according to both conditions
      filteredIds1 = table.filterTable(table,condition1)
      filteredIds2 = table.filterTable(table,condition2)
      //concatenates the two filtered lists
      filteredConcat = filteredIds1.concat(filteredIds2)
      //goes through the filtered list to remove duplicates
      for(i=0;i<filteredConcat.length;i++){
        if(filteredIds.indexOf(filteredConcat[i]==-1)){
          filteredIds.push(filteredConcat[i])
        }
      }
      break;
  }
  return filteredIds
}

bd.methodTag.table.updateSideBar = function() {

  var entity = this.model;
  var sideBarEntityContainer = document.getElementById(this.sideBarPanelName);

  var nameInputElement = sideBarEntityContainer.getElementsByClassName("nameInput")[0];
  nameInputElement.value = entity.name;
  bd.util.setTextInputChangeEventHandlers(nameInputElement,{entityId:entity.id,propertyName:"name",updateInstances:false},null,bd.sideBar.ctr.textUpdateSuccess,null);

  //update table instance dropdown menu
  var tableDropDownElement = sideBarEntityContainer.getElementsByClassName("tableDropDown")[0];
  if(tableDropDownElement.options[tableDropDownElement.selectedIndex]){
    var oldValue = parseInt(tableDropDownElement.options[tableDropDownElement.selectedIndex].value)
  }
  for(i=tableDropDownElement.options.length-1;i>=0;i--){
    tableDropDownElement.remove(i)
  }
  var instances = entity.instanceIds
  var dropDownValues = []
  for(i=0;i<instances.length;i++){
    var table = bd.component.lookup(instances[i])
    var opt = document.createElement("option");
    tableDropDownElement.options.add(opt);
    opt.text = table.model.name
    opt.value = table.model.id
    dropDownValues.push(table.model.id)
  }
  if(oldValue && dropDownValues.indexOf(oldValue)!=-1){
    tableDropDownElement.value = oldValue
  }
  if(instances.length==0){
    sideBarEntityContainer.getElementsByClassName("tableInstanceEdit")[0].style.display = "none";
    sideBarEntityContainer.getElementsByClassName("tableInstanceDelete")[0].style.display = "none";
  } else {
    sideBarEntityContainer.getElementsByClassName("tableInstanceEdit")[0].style.display = "block";
    sideBarEntityContainer.getElementsByClassName("tableInstanceDelete")[0].style.display = "block";
  }
}

bd.methodTag.table.removeConnections = function(){
  var entity = bd.model.entityLookup(this.id)
  bd.model.addModelUpdateElement([entity.parentId],"removeValue","instanceIds",this.id,{updateUIForOrigin:false,updateModelForOrigin:true,updateModelInEditor:true,updateUIInEditor:false});
}
