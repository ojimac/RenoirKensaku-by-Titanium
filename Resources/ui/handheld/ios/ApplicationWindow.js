function ApplicationWindow(_title) {
  var MapWindow = require('ui/common/MapWindow');
  var MapWin    = new MapWindow('renoir map');

  return MapWin;
}

module.exports = ApplicationWindow;
