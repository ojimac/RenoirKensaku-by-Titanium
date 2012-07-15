function ApplicationTabGroup() {
  var self = Ti.UI.createTabGroup();

  // create module instance
  var MapWindow   = require('ui/common/MapWindow');
  var EtcWindow = require('ui/common/EtcWindow');

  // create app tabs
  var MapWin = new MapWindow('renoir map');
  var MapTab = Ti.UI.createTab({
    title : 'map',
    window : MapWin
  });
  MapWin.containingTab = MapTab;
  self.addTab(MapTab);

  var EtcWin = new EtcWindow('その他');
  var EtcTab = Ti.UI.createTab({
    title : 'その他',
    window : EtcWin
  });
  EtcWin.containingTab = EtcTab;
  self.addTab(EtcTab);

  return self;
}
module.exports = ApplicationTabGroup;
