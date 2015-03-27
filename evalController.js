goog.provide("bd.evaluator.ctr");

goog.require('goog.html.SafeHtml');

bd.evaluator.ctr.configs = {};
bd.evaluator.ctr.callStack= [];
bd.evaluator.ctr.context = {};
bd.evaluator.ctr.stopEval = false;
bd.evaluator.ctr.breakLoop = false;
bd.evaluator.ctr.runEvalScript = false;
bd.evaluator.ctr.evalCounter = 0;
bd.evaluator.ctr.MAX_CALLS = 150;
bd.evaluator.ctr.isSpeaking = false;

bd.evaluator.ctr.callStackObjectsForTick = [];

//contains the stacks in queue to be evaluated
bd.evaluator.ctr.stacksToEvaluate = [];

bd.evaluator.ctr.activeTimerIds = {};
var d = new Date();
bd.evaluator.ctr.timerStart = d.getTime()
bd.evaluator.ctr.nullBlockString = "nullObject"

bd.evaluator.ctr.setupEvaluator = function(){

}
//This file contains the code that executes each of the table blocks.
/*Since this file is a copy of the original, I deleted all the code I didn't write.
All the code below is my own.*/

// ********************************************** //
// ********************************************** //
// ********************************************** //
// ***** BLOCKS WITH OUTPUT (RETURN VALUES) ***** //

bd.evaluator.ctr.configs["table_get_dimension"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"columnOrRow",type:"field",fieldName:"DIMENSION"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0]);
    var columnOrRow = stackObject.params.columnOrRow;
    var parentTable = bd.component.lookup(table.model.parentId)
    var dimension = {COLUMN:parentTable.model.columnIds.length,ROW:table.model.rowIds.length};
    bd.evaluator.ctr.returnHandler(dimension[columnOrRow],block.returnsEntity);
  }
};

//TODO: what to return if index passed in exceeds the bounds of the data list?
bd.evaluator.ctr.configs["table_get_row"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"row",type:"value",valueName:"ROW"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var row = Math.floor(stackObject.params.row)-1;
    bd.evaluator.ctr.returnHandler(table.model.rowIds[row],block.returnsEntity);
  }
};

bd.evaluator.ctr.configs["table_get_row_position"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableRow",type:"value",valueName:"TABLEROW"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var row = stackObject.params.tableRow
    var position;
    for (i=0;i<table.model.rowIds.length;i++){
      if (table.model.rowIds[i] == row){
        position = i+1
        break
      }
    }
    bd.evaluator.ctr.returnHandler(position,block.returnsEntity);
  }
};

bd.evaluator.ctr.configs["table_get_value_in_row"] = {
  paramsInfo  : [{name:"tableColumn",type:"entity",fieldName:"TABLECOLUMN"},
                 {name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableRow",type:"value",valueName:"TABLEROW"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var parentTable = bd.component.lookup(table.model.parentId)
    var column = stackObject.params.tableColumn[0];
    var row = stackObject.params.tableRow;
    var position;
    for (i=0;i<parentTable.model.columnIds.length;i++){
      if (parentTable.model.columnIds[i] == column){
        position = i
        break
      }
    }
    bd.evaluator.ctr.returnHandler(bd.component.lookup(row).model.data[position],block.returnsEntity);
  }
};

bd.evaluator.ctr.configs["table_get_all_rows"] = {
  paramsInfo  :[{name:"tableIdArray",type:"entity",fieldName:"TABLE"}],
  evalFunc    : function(block){
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var tableIdArray = stackObject.params.tableIdArray;
    var rowIds = bd.component.lookup(tableIdArray[0]).model.rowIds
    bd.evaluator.ctr.returnHandler(rowIds,block.returnsEntity);
  }
};

bd.evaluator.ctr.configs["table_max_min_avg_sum"] = {
  paramsInfo  : [{name:"operation",type:"field",fieldName:"OP"},
                 {name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableColumn",type:"entity",fieldName:"TABLECOLUMN"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var parentTable = bd.component.lookup(table.model.parentId)
    var columnIds = parentTable.model.columnIds;
    var column = stackObject.params.tableColumn[0]
    var index;
    for(i=0;i<columnIds.length;i++){
      if(columnIds[i] == column){
        index = i
        break
      }
    }
    var rowIds = table.model.rowIds
    var operation = stackObject.params.operation
    var output;
    if (operation == "sum" || operation == "avg"){
      var output = 0
      for(i=0;i<rowIds.length;i++){
        var rowData = bd.component.lookup(rowIds[i]).model.data
        output += rowData[index]
      }
      if (operation == "avg"){
        output /= rowIds.length
      }
    } else if (operation == "max" || operation == "min"){
      for(i=0;i<rowIds.length;i++){
        data = bd.component.lookup(rowIds[i]).model.data[index]
        if((data && data!='' && typeof data!='undefined') && (i==0 || (operation == "max" && data > output) || (operation == "min" && data < output))){
          output = data
        }
      }
    }
    bd.evaluator.ctr.returnHandler(output,block.returnsEntity);
  }
};

bd.evaluator.ctr.configs["table_filter_return"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"condition",type:"value",valueName:"CONDITION"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var rows = table.model.rowIds
    var condition = stackObject.params.condition;
    var filteredIds = table.filterTable(table,condition);

    bd.evaluator.ctr.returnHandler(filteredIds,block.returnsEntity);
  }
};

// ********************************************** //
// ********************************************** //
// ********************************************** //
// *********** BLOCKS WITH NO OUTPUT *********** //

bd.evaluator.ctr.configs["table_set_value"] = {
  paramsInfo  : [{name:"tableColumn",type:"entity",fieldName:"TABLECOLUMN"},
                 {name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableRow",type:"value",valueName:"TABLEROW"},
                 {name:"data",type:"value",valueName:"DATA"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var tableIdArray = stackObject.params.tableIdArray
    var table = bd.component.lookup(tableIdArray[0])
    var parentTable = bd.component.lookup(table.model.parentId)
    var column = stackObject.params.tableColumn[0];
    var index;
    for (i=0;i<parentTable.model.columnIds.length;i++){
      if (parentTable.model.columnIds[i] == column){
        index = i
        break
      }
    }
    //column position found
    var dataArray = bd.component.lookup(stackObject.params.tableRow).model.data;
    var data = stackObject.params.data;
    dataArray.splice(index,1,data);
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_move_to_row"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableRow",type:"value",valueName:"TABLEROW"},
                 {name:"position",type:"value",valueName:"POSITION"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    //get rowIds
    //move desired rowId to desired position in list
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var row = stackObject.params.tableRow
    var rowIds = table.model.rowIds;
    var old_index;
    for(i=0;i<rowIds.length;i++){
      if(rowIds[i]==row){
        old_index = i
        break
      }
    }
    var new_index = Math.floor(stackObject.params.position)-1;
    if(new_index>=0 && new_index<=rowIds.length-1){
      rowIds.splice(old_index,1)
      rowIds.splice(new_index,0,row)
    }
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_move_by_row"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableRow",type:"value",valueName:"TABLEROW"},
                 {name:"direction",type:"field",fieldName:"DIRECTION"},
                 {name:"number",type:"value",valueName:"NUM"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var row = stackObject.params.tableRow
    var rowIds = table.model.rowIds;
    var old_index;
    for(i=0;i<rowIds.length;i++){
      if(rowIds[i]==row){
        old_index = i
        break
      }
    }
    var number = Math.floor(stackObject.params.number);
    var direction = stackObject.params.direction;
    if (direction=="up"){
      number*=-1;
    }
    var new_index = old_index+number;
    if (new_index<0){
      new_index = 0;
    } else if (new_index>rowIds.length-1){
      new_index = rowIds.length-1;
    }
    rowIds.splice(old_index,1)
    rowIds.splice(new_index,0,row)
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_delete_row"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableRow",type:"value",valueName:"TABLEROW"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var row = stackObject.params.tableRow
    var rowIds = table.model.rowIds;
    var index;
    for(i=0;i<rowIds.length;i++){
      if(rowIds[i]==row){
        index = i
        break
      }
    }
    if(index){
      rowIds.splice(index,1)
    }
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_delete_all_rows"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var rowIds = table.model.rowIds;
    while(rowIds.length>0){
      rowIds.splice(0,1);
    }
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_sort"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableColumn",type:"entity",fieldName:"TABLECOLUMN"},
                 {name:"order",type:"field",fieldName:"ORDER"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var column = bd.component.lookup(stackObject.params.tableColumn)
    var order = stackObject.params.order
    var rowIds = table.sortTable(table,column,order)
    
    bd.model.addModelUpdateElement([table.id],"set","rowIds",rowIds,{updateUIForOrigin:true,updateModelForOrigin:true,updateModelInEditor:false,updateUIInEditor:false});
    bd.model.sendUpdates();
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_clear_value"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableColumn",type:"entity",fieldName:"TABLECOLUMN"},
                 {name:"tableRow",type:"value",valueName:"TABLEROW"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var tableIdArray = stackObject.params.tableIdArray
    var table = bd.component.lookup(tableIdArray[0])
    var parentTable = bd.component.lookup(table.model.parentId)
    var column = stackObject.params.tableColumn[0];
    var index;
    for (i=0;i<parentTable.model.columnIds.length;i++){
      if (parentTable.model.columnIds[i] == column){
        index = i
        break
      }
    }
    //column position found
    var dataArray = bd.component.lookup(stackObject.params.tableRow).model.data;
    dataArray.splice(index,1,bd.evaluator.ctr.nullBlockString);
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_clear_row"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"},
                 {name:"tableRow",type:"value",valueName:"TABLEROW"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var parentTable = bd.component.lookup(table.model.parentId)
    var rowData = bd.component.lookup(stackObject.params.tableRow).model.data;
    for(i=0;i<parentTable.model.columnIds.length;i++){
      rowData.splice(i,1,bd.evaluator.ctr.nullBlockString)
    }
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_clear_all_rows"] = {
  paramsInfo  : [{name:"tableIdArray",type:"entity",fieldName:"TABLE"}],
  evalFunc    : function(block) {
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var table = bd.component.lookup(stackObject.params.tableIdArray[0])
    var rowIds = table.model.rowIds;
    for(i=0;i<rowIds.length;i++){
      var rowData = bd.component.lookup(rowIds[i]).model.data
      for(j=0;j<rowData.length;j++){
        rowData.splice(j,1,bd.evaluator.ctr.nullBlockString);
      }
    }
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_add_row"] = {
  getParams   : function(block){
    var paramsInfoArray = [];
    // For table field
    paramsInfoArray.push({name:"tableIdArray",type:"entity",fieldName:"TABLE"});
    // For value inputs
    if(bd.util.isArray(block.value)){
      for(var i=0;i<parseInt(block.mutation._nums);i++){
        var input = block.value[i];
        paramsInfoArray.push({name:input._name,type:"value",valueName:input._name});
      }
    } else if(block.value) {
      var input = block.value
      paramsInfoArray.push({name:input._name,type:"value",valueName:input._name});
    }
    return paramsInfoArray;
  },
  evalFunc    : function(block){
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var tableId = parseInt(stackObject.params.tableIdArray[0]); //see below
    var data = [];
    if(bd.util.isArray(block.value)){
      for(var i=0;i<parseInt(block.mutation._nums);i++){
        var input = block.value[i];
        if(stackObject.params[input._name] != null){
          data.push(stackObject.params[input._name]);
        }
      }
    } else if(block.value) {
      var input = block.value
      if(stackObject.params[input._name] != null){
        data.push(stackObject.params[input._name]);
      }
    }
    
    if(data == []) {
      //TODO: throw debug warning
      bd.evaluator.ctr.returnHandler(0,block.returnsEntity);
      return;
    } else {
      var row = new bd.component.tableRow.constructor(null,tableId,data) //check that tableId corresponds to table instance
      bd.model.sendUpdates();
    }
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};

bd.evaluator.ctr.configs["table_insert_row"] = {
  getParams   : function(block){
    var paramsInfoArray = [];
    // For table field
    paramsInfoArray.push({name:"tableIdArray",type:"entity",fieldName:"TABLE"});
    // For position and value inputs
    //_nums only takes in number of column inputs, so +1 offset needed to account for position input
    for(var i=0;i<parseInt(block.mutation._nums)+1;i++){
      var input = block.value[i];
      paramsInfoArray.push({name:input._name,type:"value",valueName:input._name});
    }
    return paramsInfoArray;
  },
  evalFunc    : function(block){
    var stackObject = bd.evaluator.ctr.callStack[bd.evaluator.ctr.callStack.length-1];
    var tableId = parseInt(stackObject.params.tableIdArray[0]);
    var table = bd.component.lookup(tableId);
    var data = [];
    for(var i=1;i<parseInt(block.mutation._nums)+1;i++){ //so as to exclude the position input
      var input = block.value[i];
      if(stackObject.params[input._name] != null){
        data.push(stackObject.params[input._name]);
      }
    }
    if(data == []) {
      //TODO: throw debug warning
      bd.evaluator.ctr.returnHandler(0,block.returnsEntity);
      return;
    } else {
      var row = new bd.component.tableRow.constructor(null,tableId,data)
      bd.model.sendUpdates();
      var index = stackObject.params.POSITION-1;
      if (table.model.rowIds[table.model.rowIds.length-1] == row.id){
        var id = table.model.rowIds.splice(-1,1)[0]
        table.model.rowIds.splice(index,0,id)
      }
    }
    bd.evaluator.ctr.nextBlockInCallStack(block.next);
  }
};