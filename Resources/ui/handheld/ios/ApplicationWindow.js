function ApplicationWindow(_title) {
  var self = Ti.UI.createWindow({
    title           : _title,
    backgroundColor : 'white'
  });

  return self;
}

module.exports = ApplicationWindow;
