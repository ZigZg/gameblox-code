goog.provide('Blockly.Blocks.table');
goog.require('Blockly.Blocks');
goog.require('Blockly.Colors');

/*This file contains the code for the properties of each of the table's blocks (i.e. if it's a return block or a do block, how many inputs it has, type-checking for the inputs, etc.)*/

//NOTE: Start all block names with "table_"

/**
 * TABLE MUTATORS
 */

//TODO: figure out how to preserve connections
Blockly.Blocks['table_add_row'] = {

  helpUrl: '',
  init: function() {
    // Assign 'this' to a variable for use in the closures below.
    //    var thisBlock = this;
    this.setColour(Blockly.Colors.COMPONENT_SET_COLOR);

    this.updateInputList = function(text){
      var table = bd.component.lookup(bd.blocks.ctr.getFieldType(this.block,'TABLE').entityClassId);
      var dropDownText = this.block.getFieldValue('TABLE');
      if(this.block.getInput('DUMMY')){
        this.block.removeInput('DUMMY')
      } else {
        for(var i=0,input;input=this.block.getInput('VAR'+i);i++){
          this.block.removeInput('VAR'+i);
        }
      }
      this.numCount_ = table.model.columnIds.length;
      this.block.addInputs(table,dropDownText);
    }

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}};//,
                            //"GRID_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}};

    this.numCount_ = 0;

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
  },
  addInputs: function(table,text) {
    tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");
    tableDropDown.changeHandler_ = Blockly.bd.blocks.ctr.entityDropDownChangeHandler
    if(!table || table == bd.blocks.ctr.emptyFieldBox || table.model.columnIds.length == 0){ //remove table.model.columnIds later
      this.appendDummyInput('DUMMY')
        .appendField("add to ")
        .appendField(tableDropDown,'TABLE')
    } else {
      var columnIds = table.model.columnIds;
      for(i=0;i<columnIds.length;i++){
        var type = bd.component.lookup(columnIds[i]).model.columnType
        if(i==0){
          this.appendValueInput('VAR0').setCheck(type)
            .appendField("add to ")
            .appendField(tableDropDown,'TABLE')
            .appendField(": ")
            .appendField(bd.component.lookup(columnIds[i]).model.columnName).setAlign(Blockly.ALIGN_RIGHT);
        } else {
          this.appendValueInput('VAR'+i).setCheck(type)
            .appendField(bd.component.lookup(columnIds[i]).model.columnName).setAlign(Blockly.ALIGN_RIGHT);
        }
      }
      if (text){
        this.setFieldValue(text,'TABLE');
      }
    }
    this.entityTitles = ['TABLE'];
    bd.blocks.ctr.populateDefaults.call(this);
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var tableId;
    if (bd.blocks.ctr.getFieldType(this,'TABLE')){
      var object = bd.blocks.ctr.getFieldType(this, 'TABLE')
      tableId = bd.blocks.ctr.getFieldType(this,'TABLE').entityClassId;
    } else if (bd.model.currentGame.tables[0]){
      tableId = bd.model.currentGame.tables[0].id
    }
    if (tableId){
      container.setAttribute('table',tableId);
      this.numCount_ = bd.component.lookup(tableId).model.columnIds.length;
    }
    container.setAttribute('nums', this.numCount_);
    return container;
  },
  domToMutation: function(xmlElement) {
    var tableId = xmlElement.getAttribute('table');
    if (!tableId){
      if (bd.model.currentGame.tables[0]){
        tableId = bd.model.currentGame.tables[0].id
      }
    }
    var table = null;
    if(tableId){
      table = bd.component.lookup(tableId);
    }
    this.addInputs(table)
    bd.blocks.ctr.populateDefaults.call(this);
  } //???
};

//TODO: figure out how to preserve connections
Blockly.Blocks['table_insert_row'] = {

  helpUrl: '',
  init: function() {
    // Assign 'this' to a variable for use in the closures below.
    //    var thisBlock = this;
    this.setColour(Blockly.Colors.COMPONENT_SET_COLOR);

    this.updateInputList = function(text){
      var table = bd.component.lookup(bd.blocks.ctr.getFieldType(this.block,'TABLE').entityClassId);
      var dropDownText = this.block.getFieldValue('TABLE');
      if(this.block.getInput('DUMMY')){
        this.block.removeInput('DUMMY')
      } else {
        this.block.removeInput('POSITION')
        for(var i=0,input;input=this.block.getInput('VAR'+i);i++){
          this.block.removeInput('VAR'+i);
        }
      }
      this.numCount_ = table.model.columnIds.length;
      this.block.addInputs(table,dropDownText);
    }

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}};//,
                            //"GRID_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}};

    this.numCount_ = 0;

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
  },
  addInputs: function(table,text) {
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");
    tableDropDown.changeHandler_ = Blockly.bd.blocks.ctr.entityDropDownChangeHandler
    if(!table || table == bd.blocks.ctr.emptyFieldBox || table.model.columnIds.length == 0){ //remove table.model.columnIds part later
      this.appendDummyInput('DUMMY')
        .appendField("insert on ")
        .appendField(tableDropDown,'TABLE')
    } else {
      var columnIds = table.model.columnIds;
      this.appendValueInput('POSITION').setCheck('Number')
        .appendField("insert on ")
        .appendField(tableDropDown,'TABLE')
        .appendField(" at: ")
      for(i=0;i<columnIds.length;i++){
        var type = bd.component.lookup(columnIds[i]).model.columnType
        this.appendValueInput('VAR'+i).setCheck(type)
          .appendField(bd.component.lookup(columnIds[i]).model.columnName+":").setAlign(Blockly.ALIGN_RIGHT);
      }
      if (text){
        this.setFieldValue(text,'TABLE');
      }
    }
    this.entityTitles = ['TABLE'];
    bd.blocks.ctr.populateDefaults.call(this);
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var tableId;
    if (bd.blocks.ctr.getFieldType(this,'TABLE')){
      tableId = bd.blocks.ctr.getFieldType(this,'TABLE').entityClassId;
    } else if (bd.model.currentGame.tables[0]){
      tableId = bd.model.currentGame.tables[0].id
    }
    if (tableId){
      container.setAttribute('table',tableId);
      this.numCount_ = bd.component.lookup(tableId).model.columnIds.length;
    }
    container.setAttribute('nums', this.numCount_);
    return container;
  },
  domToMutation: function(xmlElement) {
    var tableId = xmlElement.getAttribute('table');
    if (!tableId){
      if (bd.model.currentGame.tables[0]){
        tableId = bd.model.currentGame.tables[0].id
      }
    }
    var table = null;
    if(tableId){
      table = bd.component.lookup(tableId);
    }
    this.addInputs(table)
    bd.blocks.ctr.populateDefaults.call(this);
  } //???
};

Blockly.Blocks['table_move_to_row'] = {
 
  helpUrl: '',
  init: function() {
    // Assign 'this' to a variable for use in the closures below.
    //    var thisBlock = this;
    this.setColour(Blockly.Colors.COMPONENT_SET_COLOR);
    this.setInputsInline(true);

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}};//,
                            //"GRID_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}};

    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");
    
    this.appendValueInput('TABLEROW')
      .setCheck([Blockly.Blocks.table.compareCxnCheck])
      .appendField("move ")
      .appendField(tableDropDown,'TABLE')
      .appendField("'s row ");
    this.appendValueInput('POSITION').setCheck("Number")
      .appendField("to index ");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityTitles = ["TABLE"];
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_move_by_row'] = {

  helpUrl: '',
  init: function() {
    // Assign 'this' to a variable for use in the closures below.
    //    var thisBlock = this;
    this.setColour(Blockly.Colors.COMPONENT_SET_COLOR);
    this.setInputsInline(true);

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}};//,
                            //"GRID_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}};

    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");
    var dirDropDown = new Blockly.FieldDropdown([["up","up"],["down","down"]], null);

    this.appendValueInput('TABLEROW')
      .setCheck([Blockly.Blocks.table.compareCxnCheck])
      .appendField("move ")
      .appendField(tableDropDown,'TABLE')
      .appendField("'s row ");
    this.appendValueInput('NUM').setCheck('Number')
      .appendField(dirDropDown,'DIRECTION')
      .appendField(" by ");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityTitles = ["TABLE"];
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_delete_row'] = {

  helpUrl: '',
  init: function() {
    // Assign 'this' to a variable for use in the closures below.
    //    var thisBlock = this;
    this.setColour(Blockly.Colors.COMPONENT_SET_COLOR);

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}};//,
                            //"GRID_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}};

    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");
    
    this.appendValueInput('TABLEROW')
      .setCheck([Blockly.Blocks.table.compareCxnCheck])
      .appendField("delete ")
      .appendField(tableDropDown,'TABLE')
      .appendField("'s row ");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityTitles = ["TABLE"];
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_delete_all_rows'] = {

  helpUrl: '',
  init: function() {
    // Assign 'this' to a variable for use in the closures below.
    //    var thisBlock = this;
    this.setColour(Blockly.Colors.COMPONENT_SET_COLOR);

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}};//,
                            //"GRID_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}};

    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");
    
    this.appendDummyInput()
      .appendField("delete all of ")
      .appendField(tableDropDown,'TABLE')
      .appendField("'s rows");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityTitles = ["TABLE"];
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

//block to set rows in a table to the rows in a list 

 //------------------------------------------------------------------------------

 /**
  * ROW MUTATORS
  */

Blockly.Blocks['table_set_value'] = {
  
  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.setInputsInline(true);
    this.hasTypeDropdown = true;

    //when a new entity is chosen, make the value of the column drop down the first
    //value in the drop down list
    this.updateColumnList= function(text){
      this.block.columnDropDown.setValue(this.block.columnDropDown.menuGenerator_()[0][1]);
    }

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.columnDropDown = new Blockly.FieldDropdown([["",bd.blocks.ctr.emptyFieldBox]]);
    this.columnDropDown.block = this;
    this.columnDropDown.titleName = 'TABLECOLUMN';
    this.columnDropDown.changeHandler_ = Blockly.bd.blocks.ctr.entityFieldDropDownChangeHandler;

    this.columnDropDown.menuGenerator_ = function(){
     return this.block.getColumnDropDownSelectionArray();
    };

    this.appendValueInput('TABLEROW')
      .setCheck([Blockly.Blocks.table.compareCxnCheck])
      .appendField("set ")
      .appendField(tableDropDown,"TABLE")
      .appendField("'s ")
      .appendField(this.columnDropDown,"TABLECOLUMN")
      .appendField(" column, row ");
    this.appendValueInput('DATA')
      .setCheck([Blockly.Blocks.table.columnCxnCheck])
      .appendField(" to ")

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
    this.entityTitles = ["TABLE","TABLECOLUMN"];
  },
  getColumnDropDownSelectionArray : function() {
    var nameArray = []
    var defaultArray = [["",bd.blocks.ctr.emptyFieldBox]];
    var fieldTypeObject = bd.blocks.ctr.getFieldType(this,"TABLE");
    if(fieldTypeObject == null) {
      return defaultArray;
    }
    var entity = bd.model.entityLookup(fieldTypeObject.entityClassId);
    if (entity == null) {
      this.getField_("TABLECOLUMN").setText('')
      return defaultArray
    }
    if(entity.parentId != null) {
      entity = bd.model.entityLookup(entity.parentId);
    }
    var column;
    for(var i=0;i<entity.columnIds.length;i++){
      column = bd.model.entityLookup(entity.columnIds[i]);
      nameArray.push([column.columnName,"id:" + column.id]);
    }
    if (nameArray.length==0){
      return defaultArray
    } else {
      return nameArray;
    }
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

//Block to set entire row with values passed in?

Blockly.Blocks['table_clear_value'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.hasTypeDropdown = true;

    //when a new entity is chosen, make the value of the column drop down the first
    //value in the drop down list
    this.updateColumnList= function(text){
      this.block.columnDropDown.setValue(this.block.columnDropDown.menuGenerator_()[0][1]);
    }

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.columnDropDown = new Blockly.FieldDropdown([["",bd.blocks.ctr.emptyFieldBox]]);
    this.columnDropDown.block = this;
    this.columnDropDown.titleName = 'TABLECOLUMN';
    this.columnDropDown.changeHandler_ = Blockly.bd.blocks.ctr.entityFieldDropDownChangeHandler;

    this.columnDropDown.menuGenerator_ = function(){
     return this.block.getColumnDropDownSelectionArray();
    };

    this.appendValueInput('TABLEROW')
      .setCheck([Blockly.Blocks.table.compareCxnCheck])
      .appendField("clear ")
      .appendField(tableDropDown,"TABLE")
      .appendField("'s ")
      .appendField(this.columnDropDown,"TABLECOLUMN")
      .appendField(" column, row ");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
    this.entityTitles = ["TABLE","TABLECOLUMN"];
  },
  getColumnDropDownSelectionArray : function() {
    var nameArray = []
    var defaultArray = [["",bd.blocks.ctr.emptyFieldBox]];
    var fieldTypeObject = bd.blocks.ctr.getFieldType(this,"TABLE");
    if(fieldTypeObject == null) {
      return defaultArray;
    }
    var entity = bd.model.entityLookup(fieldTypeObject.entityClassId);
    if (entity == null) {
      this.getField_("TABLECOLUMN").setText('')
      return defaultArray
    }
    if(entity.parentId != null) {
      entity = bd.model.entityLookup(entity.parentId);
    }
    var column;
    for(var i=0;i<entity.columnIds.length;i++){
      column = bd.model.entityLookup(entity.columnIds[i]);
      nameArray.push([column.columnName,"id:" + column.id]);
    }
    if (nameArray.length==0){
      return defaultArray
    } else {
      return nameArray;
    }
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    bd.blocks.ctr.populateDefaults.call(this);
    bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_clear_row'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.appendValueInput('TABLEROW')
      .setCheck([Blockly.Blocks.table.compareCxnCheck])
      .appendField("clear ")
      .appendField(tableDropDown,"TABLE")
      .appendField("'s row");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:0}];
    this.entityTitles = ["TABLE"];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_clear_all_rows'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.appendDummyInput()
      .appendField("clear all ")
      .appendField(tableDropDown,"TABLE")
      .appendField("'s rows");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:0}];
    this.entityTitles = ["TABLE"];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

//------------------------------------------------------------------------------

/**
 * GETTER METHODS
 */

Blockly.Blocks['table_get_value_in_row'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.setOutput(true,[Blockly.Blocks.table.parameterCxnCheck]);
    this.hasTypeDropdown = true;

    //when a new entity is chosen, make the value of the column drop down the first
    //value in the drop down list
    this.updateColumnList= function(text){
      this.block.columnDropDown.setValue(this.block.columnDropDown.menuGenerator_()[0][1]);
    }

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.columnDropDown = new Blockly.FieldDropdown([["",bd.blocks.ctr.emptyFieldBox]]);
    this.columnDropDown.block = this;
    this.columnDropDown.titleName = 'TABLECOLUMN';
    this.columnDropDown.changeHandler_ = Blockly.bd.blocks.ctr.entityFieldDropDownChangeHandler;

    this.columnDropDown.menuGenerator_ = function(){
      return this.block.getColumnDropDownSelectionArray();
    };

    this.appendValueInput('TABLEROW')
      .setCheck([Blockly.Blocks.table.compareCxnCheck])
      .appendField(tableDropDown,"TABLE")
      .appendField("'s ")
      .appendField(this.columnDropDown,"TABLECOLUMN")
      .appendField(" column, row ");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
    this.entityTitles = ["TABLE","TABLECOLUMN"];

  },
  getColumnDropDownSelectionArray : function() {
    var nameArray = []
    var defaultArray = [["",bd.blocks.ctr.emptyFieldBox]];
    var fieldTypeObject = bd.blocks.ctr.getFieldType(this,"TABLE");
    if(fieldTypeObject == null) {
      return defaultArray;
    }
    var entity = bd.model.entityLookup(fieldTypeObject.entityClassId);
    if (entity == null) {
      this.getField_("TABLECOLUMN").setText('')
      return defaultArray
    }
    if(entity.parentId != null) {
      entity = bd.model.entityLookup(entity.parentId);
    }
    var column;
    for(var i=0;i<entity.columnIds.length;i++){
      column = bd.model.entityLookup(entity.columnIds[i]);
      nameArray.push([column.columnName,"id:" + column.id]);
    }
    if (nameArray.length==0){
      return defaultArray
    } else {
      return nameArray;
    }
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    bd.blocks.ctr.populateDefaults.call(this);
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_get_row'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.setOutput(true, [Blockly.Blocks.table.parameterCxnCheck]);

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.appendValueInput('ROW').setCheck("Number")
      .appendField(tableDropDown,"TABLE")
      .appendField("'s row with index");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:0}];
    this.entityTitles = ["TABLE"];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_get_row_position'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.setOutput(true, "Number");

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.appendValueInput('TABLEROW')
      .setCheck([Blockly.Blocks.table.compareCxnCheck])
      .appendField("position of")
      .appendField(tableDropDown,"TABLE")
      .appendField("'s row");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:0}];
    this.entityTitles = ["TABLE"];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

//get number of rows/columns in table
Blockly.Blocks['table_get_dimension'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.setOutput(true, "Number");

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}

    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.appendDummyInput()
      .appendField("total number of ")
      .appendField(new Blockly.FieldDropdown([['columns', 'COLUMN'], ['rows', 'ROW']]),'DIMENSION')
      .appendField(" in ")
      .appendField(tableDropDown,"TABLE");

    var thisBlock = this
    this.setTooltip(function(){
      //var mode = thisBlock.getFieldValue('DIMENSION')
      //var tooltips = {'COLUMN':Blockly.Msg.GRID_COLUMN_TOOLTIP,
      //                'ROW':Blockly.Msg.GRID_ROW_TOOLTIP}
      //return bd.blocks.ctr.interpolateTooltip(Blockly.Msg.RETURN_NUM_COLUMN_ROW_TOOLTIP,[tooltips[mode]])
    });
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:0}];
    this.entityTitles = ["TABLE"];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_get_all_rows'] = {
	
	helpUrl: "",
	init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.setOutput(true); // TODO: return type is a list
    this.setInputsInline(true);


    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.appendDummyInput("TABLE")
    	.appendField("all ")
    	.appendField(tableDropDown,"TABLE")
    	.appendField("'s rows");

    this.setTooltip("");
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
    this.entityTitles = ["TABLE"];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
  	Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
  	return container;
  },
  domToMutation: function(xmlElement) {
  	Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

//------------------------------------------------------------------------------

/**
 * TABLE OPERATIONS
 */

Blockly.Blocks['table_sort'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.hasTypeDropdown = true;

    //when a new entity is chosen, make the value of the column drop down the first
    //value in the drop down list
    this.updateColumnList= function(text){
      this.block.columnDropDown.setValue(this.block.columnDropDown.menuGenerator_()[0][1]);
    }

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");
    var orderDropDown = new Blockly.FieldDropdown([["increasing","increasing"],["decreasing","decreasing"]], null);

    this.columnDropDown = new Blockly.FieldDropdown([["",bd.blocks.ctr.emptyFieldBox]]);
    this.columnDropDown.block = this;
    this.columnDropDown.titleName = 'TABLECOLUMN';
    this.columnDropDown.changeHandler_ = Blockly.bd.blocks.ctr.entityFieldDropDownChangeHandler;

    this.columnDropDown.menuGenerator_ = function(){
     return this.block.getColumnDropDownSelectionArray();
    };

    this.appendDummyInput()
      .appendField("sort ")
      .appendField(tableDropDown,"TABLE")
      .appendField(" by ")
      .appendField(this.columnDropDown,"TABLECOLUMN")
      .appendField(" in ")
      .appendField(orderDropDown,"ORDER")
      .appendField(" order");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
    this.entityTitles = ["TABLE","TABLECOLUMN"];
  },
  getColumnDropDownSelectionArray : function() {
    var nameArray = []
    var defaultArray = [["",bd.blocks.ctr.emptyFieldBox]];
    var fieldTypeObject = bd.blocks.ctr.getFieldType(this,"TABLE");
    if(fieldTypeObject == null) {
      return defaultArray;
    }
    var entity = bd.model.entityLookup(fieldTypeObject.entityClassId);
    if (entity == null) {
      this.getField_("TABLECOLUMN").setText('')
      return defaultArray
    }
    if(entity.parentId != null) {
      entity = bd.model.entityLookup(entity.parentId);
    }
    var column;
    for(var i=0;i<entity.columnIds.length;i++){
      column = bd.model.entityLookup(entity.columnIds[i]);
      nameArray.push([column.columnName,"id:" + column.id]);
    }
    if (nameArray.length==0){
      return defaultArray
    } else {
      return nameArray;
    }
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
  	bd.blocks.ctr.populateDefaults.call(this);
    bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_max_min_avg_sum'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.hasTypeDropdown = true;
    this.setOutput(true, "Number");

    //when a new entity is chosen, make the value of the column drop down the first
    //value in the drop down list
    this.updateColumnList= function(text){
      this.block.columnDropDown.setValue(this.block.columnDropDown.menuGenerator_()[0][1]);
    }

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");
    var operationDropDown = new Blockly.FieldDropdown([["max","max"],["min","min"],["sum","sum"],["avg","avg"]], null);

    this.columnDropDown = new Blockly.FieldDropdown([["",bd.blocks.ctr.emptyFieldBox]]);
    this.columnDropDown.block = this;
    this.columnDropDown.titleName = 'TABLECOLUMN';
    this.columnDropDown.changeHandler_ = Blockly.bd.blocks.ctr.entityFieldDropDownChangeHandler;

    this.columnDropDown.menuGenerator_ = function(){
     return this.block.getColumnDropDownSelectionArray();
    };

    this.appendDummyInput()
      .appendField(operationDropDown,'OP')
      .appendField(" of ")
      .appendField(tableDropDown,"TABLE")
      .appendField("'s ")
      .appendField(this.columnDropDown,"TABLECOLUMN")
      .appendField(" column ");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
    this.entityTitles = ["TABLE","TABLECOLUMN"];
  },
  getColumnDropDownSelectionArray : function() {
    var nameArray = []
    var defaultArray = [["",bd.blocks.ctr.emptyFieldBox]];
    var fieldTypeObject = bd.blocks.ctr.getFieldType(this,"TABLE");
    if(fieldTypeObject == null) {
      return defaultArray;
    }
    var entity = bd.model.entityLookup(fieldTypeObject.entityClassId);
    if (entity == null) {
      this.getField_("TABLECOLUMN").setText('')
      return defaultArray
    }
    if(entity.parentId != null) {
      entity = bd.model.entityLookup(entity.parentId);
    }
    var column;
    for(var i=0;i<entity.columnIds.length;i++){
      column = bd.model.entityLookup(entity.columnIds[i]);
      if(column.columnType=="Number"){
        nameArray.push([column.columnName,"id:" + column.id]);
      }
    }
    if (nameArray.length==0){
      return defaultArray
    } else {
      return nameArray;
    }
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    bd.blocks.ctr.populateDefaults.call(this);
    bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_filter'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.appendValueInput('CONDITION').setCheck("Condition")
      .appendField("filter ")
      .appendField(tableDropDown,"TABLE")
      .appendField(" by ");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:0}];
    this.entityTitles = ["TABLE"];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['table_filter_return'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.setOutput(true); // TODO: return type is a list


    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.appendValueInput("CONDITION").setCheck("Condition")
      .appendField(tableDropDown,"TABLE")
      .appendField("'s rows with ");

    this.setTooltip("");
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
    this.entityTitles = ["TABLE"];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

//------------------------------------------------------------------------------

/**
 * FILTER CONDITIONS
 */

Blockly.Blocks['condition_compare'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    //this.hasTypeDropdown = true;
    this.setOutput(true, "Condition");
    this.setInputsInline(true);

    var operationDropDown = new Blockly.FieldDropdown([["before","before"],["after","after"],["equal to","equal to"]], null);

    this.appendValueInput('PARAM').setCheck("Condition Parameter")
    this.appendValueInput('COMP').setCheck(["String"])
      .appendField(" is ")
      .appendField(operationDropDown,'OP')
      .appendField(" ")

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.entityPlayerEntityNames = [];
    this.entityTitles = [];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    bd.blocks.ctr.populateDefaults.call(this);
    bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['condition_boolean'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    //this.hasTypeDropdown = true;
    this.setOutput(true, "Condition");
    this.setInputsInline(true);

    this.appendValueInput('COND1').setCheck("Condition")
    this.appendValueInput('COND2').setCheck("Condition")
      .appendField(" and ")

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.entityPlayerEntityNames = [];
    this.entityTitles = [];
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    bd.blocks.ctr.populateDefaults.call(this);
    bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['condition_numerical_compare'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.hasTypeDropdown = true;
    this.setOutput(true, "Condition");
    this.setInputsInline(true);

    //when a new entity is chosen, make the value of the column drop down the first
    //value in the drop down list
    this.updateColumnList= function(text){
      this.block.columnDropDown.setValue(this.block.columnDropDown.menuGenerator_()[0][1]);
    }

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");
    
    if (Blockly.RTL) {
      var OPERATORS = [
        ['=', 'EQ'],
        ['\u2260', 'NEQ'],
        ['>', 'LT'],
        ['\u2265', 'LTE'],
        ['<', 'GT'],
        ['\u2264', 'GTE']
      ];
    } else {
      var OPERATORS = [
        ['=', 'EQ'],
        ['\u2260', 'NEQ'],
        ['<', 'LT'],
        ['\u2264', 'LTE'],
        ['>', 'GT'],
        ['\u2265', 'GTE']
      ];
    }
    var operationDropDown = new Blockly.FieldDropdown(OPERATORS, null);

    this.columnDropDown = new Blockly.FieldDropdown([["",bd.blocks.ctr.emptyFieldBox]]);
    this.columnDropDown.block = this;
    this.columnDropDown.titleName = 'TABLECOLUMN';
    this.columnDropDown.changeHandler_ = Blockly.bd.blocks.ctr.entityFieldDropDownChangeHandler;

    this.columnDropDown.menuGenerator_ = function(){
     return this.block.getColumnDropDownSelectionArray();
    };

    this.appendValueInput('NUM').setCheck("Number")
      .appendField(tableDropDown,"TABLE")
      .appendField("'s ")
      .appendField(this.columnDropDown,"TABLECOLUMN")
      .appendField(" ")
      .appendField(operationDropDown,'OP')
      .appendField(" ");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
    this.entityTitles = ["TABLE","TABLECOLUMN"];
  },
  getColumnDropDownSelectionArray : function() {
    var nameArray = []
    var defaultArray = [["",bd.blocks.ctr.emptyFieldBox]];
    var fieldTypeObject = bd.blocks.ctr.getFieldType(this,"TABLE");
    if(fieldTypeObject == null) {
      return defaultArray;
    }
    var entity = bd.model.entityLookup(fieldTypeObject.entityClassId);
    if (entity == null) {
      this.getField_("TABLECOLUMN").setText('')
      return defaultArray
    }
    if(entity.parentId != null) {
      entity = bd.model.entityLookup(entity.parentId);
    }
    var column;
    for(var i=0;i<entity.columnIds.length;i++){
      column = bd.model.entityLookup(entity.columnIds[i]);
      if(column.columnType=="Number"){
        nameArray.push([column.columnName,"id:" + column.id]);
      }
    }
    if (nameArray.length==0){
      return defaultArray
    } else {
      return nameArray;
    }
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    bd.blocks.ctr.populateDefaults.call(this);
    bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['column_return'] = {

  helpUrl: "",
  init: function() {
    this.setColour(Blockly.Colors.COMPONENT_GET_COLOR);
    this.setOutput(true,"Condition Parameter");
    this.hasTypeDropdown = true;

    //when a new entity is chosen, make the value of the column drop down the first
    //value in the drop down list
    this.updateColumnList= function(text){
      this.block.columnDropDown.setValue(this.block.columnDropDown.menuGenerator_()[0][1]);
    }

    this.entityDropDowns = {"TABLE":{dropDownEntities:[{name:"tableInstance",selections:["entityList"]}],switchInput:"toBlock"}}//,
                            //"TABLE_PLAYER":{dropDownEntities:[{name:"player",selections:["entityList"]}],switchInput:"toBlock"}}
    var tableDropDown = Blockly.bd.blocks.ctr.createEntityDropDown(this,this.entityDropDowns["TABLE"].dropDownEntities,this.entityDropDowns["TABLE"].switchInput,"TABLE");

    this.columnDropDown = new Blockly.FieldDropdown([["",bd.blocks.ctr.emptyFieldBox]]);
    this.columnDropDown.block = this;
    this.columnDropDown.titleName = 'TABLECOLUMN';
    this.columnDropDown.changeHandler_ = Blockly.bd.blocks.ctr.entityFieldDropDownChangeHandler;

    this.columnDropDown.menuGenerator_ = function(){
      return this.block.getColumnDropDownSelectionArray();
    };

    this.appendDummyInput()
      .appendField(tableDropDown,"TABLE")
      .appendField("'s ")
      .appendField(this.columnDropDown,"TABLECOLUMN");

    //this.setTooltip(Blockly.Msg.RETURN_GRID_TILE_TOOLTIP);
    this.entityPlayerEntityNames = [{name:"TABLE",inputNum:0,appendTitleIndex:1}];
    this.entityTitles = ["TABLE","TABLECOLUMN"];

  },
  getColumnDropDownSelectionArray : function() {
    var nameArray = []
    var defaultArray = [["",bd.blocks.ctr.emptyFieldBox]];
    var fieldTypeObject = bd.blocks.ctr.getFieldType(this,"TABLE");
    if(fieldTypeObject == null) {
      return defaultArray;
    }
    var entity = bd.model.entityLookup(fieldTypeObject.entityClassId);
    if (entity == null) {
      this.getField_("TABLECOLUMN").setText('')
      return defaultArray
    }
    if(entity.parentId != null) {
      entity = bd.model.entityLookup(entity.parentId);
    }
    var column;
    for(var i=0;i<entity.columnIds.length;i++){
      column = bd.model.entityLookup(entity.columnIds[i]);
      if(column.columnType!="Number"){
        nameArray.push([column.columnName,"id:" + column.id]);
      }
    }
    if (nameArray.length==0){
      return defaultArray
    } else {
      return nameArray;
    }
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    Blockly.bd.blocks.ctr.mutationToDomEntityPlayer(container,this);
    return container;
  },
  domToMutation: function(xmlElement) {
    bd.blocks.ctr.populateDefaults.call(this);
    Blockly.bd.blocks.ctr.domToMutationEntityPlayer(xmlElement,this);
  }
};

Blockly.Blocks['text_return'] = {

};

//------------------------------------------------------------------------------

/**
 * EXTRA BLOCK FUNCTIONS
 */

Blockly.Blocks.table.compareCxnCheck = function(myConnection) {
  var block = myConnection.sourceBlock_;
  var fieldValue = block.getFieldValue('TABLE')
  var tableInstanceId;
  if (fieldValue){
    if(bd.util.containsPrefix(fieldValue,"id")){
      tableInstanceId = bd.util.removePrefix(fieldValue,"id")
    }
  }
  //Blockly.Blocks.table.checkType(myConnection);
  return [bd.component.lookup(tableInstanceId).model.name]
};

Blockly.Blocks.table.parameterCxnCheck = function(myConnection) {
  var block = myConnection.sourceBlock_;
  if(block.type=="table_get_row"){
    var fieldValue = block.getFieldValue('TABLE')
    var tableInstanceId;
    if(fieldValue){
      if(bd.util.containsPrefix(fieldValue,"id")){
        tableInstanceId = bd.util.removePrefix(fieldValue,"id")
      }
    }
    //Blockly.Blocks.table.checkType(myConnection);
    return ["tableRow",bd.component.lookup(tableInstanceId).model.name]
  } else if(block.type=="table_get_value_in_row"){
    var type = bd.component.lookup(bd.blocks.ctr.getFieldType(block,'TABLECOLUMN').entityClassId).model.columnType
    //Blockly.Blocks.table.checkType(myConnection);
    return [type]
  }
};

Blockly.Blocks.table.columnCxnCheck = function(myConnection) {
  var block = myConnection.sourceBlock_;
  var type = bd.component.lookup(bd.blocks.ctr.getFieldType(block,'TABLECOLUMN').entityClassId).model.columnType
  //Blockly.Blocks.table.checkType(myConnection);
  return [type]
};
