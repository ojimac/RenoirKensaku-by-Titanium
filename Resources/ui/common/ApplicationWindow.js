function ApplicationWindow() {
  var self = Ti.UI.createWindow({
    backgroundcolor : '#ffffff'
  });

  var MapWindow = require('ui/common/MapWindow');
  var MapWin = new MapWindow();

  var navGroup = Ti.UI.iPhone.createNavigationGroup({
    window : MapWin
  });
  MapWin.nav = navGroup;
  self.add(navGroup);

  return self;
}

module.exports = ApplicationWindow;
