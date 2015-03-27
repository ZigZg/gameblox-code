goog.provide('bd.modelTag.hasTableColumnProperties');

//Note: Removed "visible" tag, see if it's needed later
bd.modelTag.hasTableColumnProperties = {
  provideFields: function(){
                   return [{fields:['tableId'],providers:["function"],fxn:bd.modelTag.hasTableColumnProperties.tableColumnId},
                           {fields:['columnName'],providers:["srcInstance","componentObject"]},
                           {fields:['columnType'],providers:["srcInstance","componentObject"]}];
                 }
}

//adds the column to the list of columns that the table has
bd.modelTag.hasTableColumnProperties.tableColumnId = function() {
  this.model.tableId = this.tableId;
  //adds column to list of column Ids in the table
  bd.model.addModelUpdateElement([this.tableId],"push","columnIds",this.model.id,{updateUIForOrigin:false,updateModelForOrigin:true,updateModelInEditor:true,updateUIInEditor:false});
  return true;
}