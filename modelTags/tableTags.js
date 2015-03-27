goog.provide('bd.modelTag.hasTableProperties');


bd.modelTag.hasTableProperties = {
  provideFields: function(){
    return [{fields:['columnIds'],classOrInstance:"class",providers:["defaultValue"],defaultValue:[],removeConnectionFxn:bd.modelTag.hasTableProperties.removeColumnIds},
            {fields:['rowIds'],classOrInstance:"instance",providers:["defaultValue"],defaultValue:[]},
            {fields:['editorRowData'],classOrInstance:"instance",providers:["function"],fxn:bd.modelTag.hasTableProperties.editorData}
           ];
  }
}

bd.modelTag.hasTableProperties.editorData = function() {
  var columns = bd.component.lookup(this.model.parentId).model.columnIds
  var initArray = [[]]
  for(i=0;i<columns.length;i++){
  	initArray[0].push('');
  }
  //adds new empty row to newly created tableInstance
  this.model.editorRowData = initArray
  return true;
}

bd.modelTag.hasTableProperties.removeColumnIds = function(){
  if(this.model.columnIds.length != 0) {
    for (var i=0;i<this.model.columnIds.length;i++) {
      var columnId = this.model.columnIds[i]
      bd.component.lookup(columnId).deleteEntity()
    }
  }
}