goog.provide('bd.component.tableRow');

//require model tags
goog.require('bd.modelTag.entity');
goog.require('bd.modelTag.hasTableRowProperties');

//require method tags
goog.require('bd.methodTag.entity');
goog.require('bd.methodTag.canvasObject')
goog.require('bd.methodTag.phaserObject')
goog.require('bd.methodTag.gridTile') /*TO CHANGE*/

bd.component.tableRow = {

  constructor: function(model,tableInstanceId,data) { //tableId?

    //Note: data should be a list
    goog.mixin(this,bd.component.tableRow.componentProperties)
    this.tableInstanceId = tableInstanceId
    this.data = data
    //this.visible = visible;

    this.model = (model != null ? model : {});
    var updateModel = (model == null);

    bd.modelTag.applyTags(this,updateModel);
    bd.methodTag.applyMethodTags(this);
  },

  componentProperties : {
    classOrInstance: "class",
    type: "tableRow",
    listName: "tableRows",
    idName: "tableRowId",
    idListName: "tableRowIds",
    editorDisplayObjectType : "image",
    defaultImageUrlObject: {url:"images/qmarksq.png", internal:true},
    possibleLayerTypes : ['tmxEntityLayer'],

    //used for name model tag
    namePrefix: "Table Row Class ",
    typeName: "Table Row",
    //name used on tab
    tabName: "Table Rows",
    entityName: "Table Row Class",
    entityNamePlural: "Table Row Classes",
    thisName: "this table row class",
    allName: "all table row classes",
    anyName: "any table row class",
    randomName: "random table row class",

    //tags that define properties in model
    modelTags: ['entity','hasTableRowProperties'],

    //tags that define methods on component
    methodTags: ['entity','canvasObject','phaserObject','gridTile']
  }
}

//what to do with these next two methods?
/*bd.component.gridTile.showEntitySelectionRow = function(listItemIndex,hideShowObject,listItemValue,boxIndex) {
  document.getElementById("gridTileEntitySelction" + boxIndex).style.display = "block";
}

bd.component.gridTile.shouldShowEntitySelectionRow = function() {
  //if any grid class exists, return true;
  return bd.model.getEntityList("grid").length != 0;
}*/

bd.component.typeNameToComponent["tableRow"] = bd.component.tableRow;