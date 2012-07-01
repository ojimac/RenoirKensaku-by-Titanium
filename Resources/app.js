var tab1, tabGroup, win;

Ti.App.config = {
  serverRoot: 'http://renoir.herokuapp.com'
  //serverRoot: 'http://localhost:3000'
};

Ti.API.debug("serverRoot: " + Ti.App.config.serverRoot);
Ti.UI.setBackgroundColor('#fff');

win = Ti.UI.createWindow({
  url: 'map.js',
  title: 'ルノアールマップ',
  backgroundColor: '#fff',
  fullscreen: false,
  exitOnClose: true
});

tab1 = Ti.UI.createTab({
  window: win
});

win.hideTabBar();

tabGroup = Ti.UI.createTabGroup();

tabGroup.addTab(tab1);

tabGroup.open();
