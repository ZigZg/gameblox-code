goog.provide('bd.component.tableColumn');

//require model tags
goog.require('bd.modelTag.entity');
goog.require('bd.modelTag.hasTableColumnProperties');

//require method tags
goog.require('bd.methodTag.entity');
goog.require('bd.methodTag.canvasObject')
goog.require('bd.methodTag.phaserObject')
goog.require('bd.methodTag.gridTile') /*TO CHANGE*/

bd.component.tableColumn = {

  constructor: function(model,tableId,columnName,columnType) {

    goog.mixin(this,bd.component.tableColumn.componentProperties)
    this.tableId = tableId
    this.columnName = columnName
    this.columnType = columnType
    //this.visible = visible;

    this.model = (model != null ? model : {});
    var updateModel = (model == null);

    bd.modelTag.applyTags(this,updateModel);
    bd.methodTag.applyMethodTags(this);
  },

  componentProperties : {
    classOrInstance: "class",
    type: "tableColumn",
    listName: "tableColumns",
    idName: "tableColumnId",
    idListName: "tableColumnIds",
    editorDisplayObjectType : "image",
    defaultImageUrlObject: {url:"images/qmarksq.png", internal:true},
    possibleLayerTypes : ['tmxEntityLayer'],

    //used for name model tag
    namePrefix: "Table Column Class ",
    typeName: "Table Column",
    //name used on tab
    tabName: "Table Columns",
    entityName: "Table Column Class",
    entityNamePlural: "Table Column Classes",
    thisName: "this table column class",
    allName: "all table column classes",
    anyName: "any table column class",
    randomName: "random table column class",

    //tags that define properties in model
    modelTags: ['entity','hasTableColumnProperties'],

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

bd.component.typeNameToComponent["tableColumn"] = bd.component.tableColumn;