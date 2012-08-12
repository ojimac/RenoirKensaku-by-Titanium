function ApplicationTabGroup() {
  var self = Ti.UI.createTabGroup();

  var MapWindow = require('ui/common/MapWindow');

  var MapWin = new MapWindow();
  var MapTab = Ti.UI.createTab({
    window : MapWin
  });
  MapWin.containingTab = MapTab;
  self.addTab(MapTab);

  return self;
}

module.exports = ApplicationTabGroup;
