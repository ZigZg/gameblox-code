goog.provide('bd.table.ctr');

bd.table.ctr.addInstance = function(){
  var id = bd.editor.ctr.getSelectedEntity().id
  var table = new bd.component.tableInstance.constructor(null, id)
  //new bd.component.tableRow.constructor(null, table.model.id, [])
  bd.sideBar.ctr.updateSideBar();
};

bd.table.ctr.deleteInstance = function(){
  var tableClass = bd.component.lookup(bd.editor.ctr.getSelectedEntity().id)
  var sideBarEntityContainer = document.getElementById(tableClass.sideBarPanelName)
  var tableDropDownElement = sideBarEntityContainer.getElementsByClassName("tableDropDown")[0];
  if(tableDropDownElement.options[tableDropDownElement.selectedIndex]){
    var tableInstanceId = parseInt(tableDropDownElement.options[tableDropDownElement.selectedIndex].value)
    //try-catch because entity may not be deletable if referenced in the blocks
    try {
      //deleting instances from instanceIds?
      /*var instances = tableClass.model.instanceIds
      for(i=0;i<instances.length;i++){
        if(instances[i]==tableInstanceId){
          instances.splice(i,1);
        }
      }*/
      bd.component.lookup(tableInstanceId).deleteInstance()
      bd.sideBar.ctr.updateSideBar();
    } catch (e) {
      if(e.type == "CannotDeleteEntityError"){
        alert(e.getDeleteErrorString());
      } else {
        throw e;
      }
    }
  }
};