goog.provide('bd.modelTag.hasTableRowProperties');

bd.modelTag.hasTableRowProperties = {
  provideFields: function(){
                   return [{fields:['tableInstanceId'],providers:["function"],fxn:bd.modelTag.hasTableRowProperties.tableRowId},
                           {fields:['data'],providers:["srcInstance","componentObject"]}];
                 }
}

//adds the row to the list of rows that the table has
bd.modelTag.hasTableRowProperties.tableRowId = function() {
  this.model.tableInstanceId = this.tableInstanceId;
  //adds row to list of row ids in the table
  bd.model.addModelUpdateElement([this.tableInstanceId],"push","rowIds",this.model.id,{updateUIForOrigin:false,updateModelForOrigin:true,updateModelInEditor:true,updateUIInEditor:false});
  return true;
}