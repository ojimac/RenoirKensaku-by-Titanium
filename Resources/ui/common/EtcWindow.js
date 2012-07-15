function DummyWindow(_title) {
  var self = Ti.UI.createWindow({
    title           : _title,
    backgroundColor : 'white'
  });

  return self;
}

module.exports = DummyWindow;
