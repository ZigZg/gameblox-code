goog.provide('bd.component.table');
goog.provide('bd.component.tableInstance');

goog.require('bd.component');

//require model tags
goog.require('bd.modelTag.entity');
goog.require('bd.modelTag.hasParentAndInstances');
goog.require('bd.modelTag.hasSrcInstanceId');
goog.require('bd.modelTag.hasBlockEntityTracking');
goog.require('bd.modelTag.hasPosition');
goog.require('bd.modelTag.hasDirection');
goog.require('bd.modelTag.hasHeightWidth');
goog.require('bd.modelTag.hasVisibility');
goog.require('bd.modelTag.hasDragability');
//goog.require('bd.modelTag.hasViewId');
//goog.require('bd.modelTag.hasLayerId');
goog.require('bd.modelTag.perPlayer');
goog.require('bd.modelTag.shareMode');
goog.require('bd.modelTag.hasTraits');
goog.require('bd.modelTag.hasScripts');
goog.require('bd.modelTag.hasTableProperties');
//any other tags?

//require method tags
goog.require('bd.methodTag.entity');
goog.require('bd.methodTag.canvasObject');
goog.require('bd.methodTag.table');

//TO ASK PAUL: How to deal with tags

bd.component.table = {

	constructor: function(model,tabId) {

    	goog.mixin(this,bd.component.table.componentProperties)
    	this.tabId = tabId;

    	//used for costume tag
        if(model == null) {
            this.defaultImageId = bd.defaultPieceAsset.id;
        }

        this.model = (model != null ? model : {});
        var updateModel = (model == null);

	    bd.modelTag.applyTags(this,updateModel);
    	bd.methodTag.applyMethodTags(this);
	},
	componentProperties : {
    	classOrInstance: "class",
    	type: "table",
    	listName: "tables",
    	idName: "tableId",
    	idListName: "tableIds",
    	/*TO LOOK AT*/editorDisplayObjectType : "image",
    	//div id of sidebar panel
    	sideBarPanelName: "sideBarTablePanel",
    	defaultImageUrlObject: {url:"images/qmarksq.png", internal:true},
    	tabIconFileName: "class-icon-tables.png",
    	possibleLayerTypes : ['tmxEntityLayer'],

	    //used for name model tag
    	namePrefix: "Table Class ",
    	typeName: "Table",
    	//name used on tab
    	tabName: "Tables",
    	entityName: "Table Class",
    	entityNamePlural: "Table Classes",
    	thisName: "this table class",
    	allName: "all table classes",
    	anyName: "any table class",
    	randomName: "random table class",

    	//tags that define properties in model
    	modelTags: ['entity','hasParentAndInstances','hasSrcInstanceId','hasBlockEntityTracking',
      		'hasPosition','hasDirection','hasHeightWidth','hasVisibility','hasDragability','hasCoordinateOffset',
      		/*'hasViewId','hasLayerId',*/'hasCostume','perPlayer','shareMode','hasTraits','hasTabContainer','hasScripts',
      		'hasTargetId', 'hasTableProperties'],

    	//tags that define methods on component
    	methodTags: ['entity','canvasObject','table']
 	},
  	beforeCreateEntity: function() {
    	var componentType = bd.component.table.componentProperties.type;
    	if(!bd.model.isMultiplayer()) {
      		bd.entitySelect.ctr.createEntity(componentType);
    	} else {
      		bd.overlay.ctr.showOverlay("shareMode",componentType);
    	}
  	}
}

bd.component.tableInstance = {

  constructor: function(model,parentId,srcInstance,playerId,visibleToPlayerId){

    bd.component.handleInstanceParameters.call(this,model,parentId,srcInstance,playerId,visibleToPlayerId);
    goog.mixin(this,bd.component.tableInstance.componentProperties)

    var updateModel = (model == null);
    //*****what to do about next line?
    //this.cellDictionary = {}

    bd.modelTag.applyTags(this,updateModel);
    bd.methodTag.applyMethodTags(this);
  },

  componentProperties : {
    classOrInstance: "instance",
    type: "tableInstance",
    listName: "tableInstances",
    idName: "tableInstanceId",
    idListName: "tableInstanceIds",
    editorDisplayObjectType : "image", //???
    //instancePanelName: "tableInstancePanel",

    //used for name model tag
    namePrefix: "table ",
    entityName: "Table",
    thisName: "this table",
    allName: "all tables",
    anyName: "any table",
    randomName: "random table",

    modelTags: bd.component.table.componentProperties.modelTags,
    methodTags: bd.component.table.componentProperties.methodTags
  }


}

bd.component.typeNameToComponent["table"] = bd.component.table;
bd.component.typeNameToComponent["tableInstance"] = bd.component.tableInstance;
bd.component.childNameToParentName["tableInstance"] = "table";


















































































