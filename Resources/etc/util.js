// 圏外の場合に出すView
/*
function noInternetView(that, web_view) {
  var reload_view = Ti.UI.createView({
    width   : Ti.UI.FILL,
    height  : Ti.UI.FILL
  });
  that.add(reload_view);

  var reload_label = Ti.UI.createLabel({
    top : 100,
    text : 'インターネット接続がありません...'
  });

  var reload_button = Ti.UI.createLabel({
    text            : 'もう一度試す',
    height          : 44,
    width           : 300,
    top             : 140,
    left            : 10,
    color           : 'white',
    textAlign       : Ti.UI.TEXT_ALIGNMENT_CENTER,
    borderRadius    : 3,
    zIndex          : 2,
    backgroundColor : Ti.App.config.tabbar_color,
    font            : {
      fontSize   : 15,
      fontWeight : 'bold'
    }
  });

  reload_button.addEventListener('click', function(e) {
    reload_view.hide();
    web_view.reload();
    web_view.show();
  });

  reload_view.add(reload_label);
  reload_view.add(reload_button);

  return reload_view;
}

// アプリ内でセッション的に使っているプロパティ値をリセット
function resetProperties() {
  info('propery reset start');
  Ti.App.Properties.removeProperty('item_id');
  Ti.App.Properties.removeProperty('image1_name');
  Ti.App.Properties.removeProperty('image2_name');
  Ti.App.Properties.removeProperty('image3_name');
  Ti.App.Properties.removeProperty('image4_name');
  Ti.App.Properties.removeProperty('image5_name');
  Ti.App.Properties.removeProperty('category_id');
  Ti.App.Properties.removeProperty('material_id');
  Ti.App.Properties.removeProperty('technic_id');
  Ti.App.Properties.removeProperty('stock');

  //debug('item_id: '     + Ti.App.Properties.getString('item_id'));
  //debug('image1_name: ' + Ti.App.Properties.getString('image1_name'));
  //debug('image2_name: ' + Ti.App.Properties.getString('image2_name'));
  //debug('image3_name: ' + Ti.App.Properties.getString('image3_name'));
  //debug('image4_name: ' + Ti.App.Properties.getString('image4_name'));
  //debug('image5_name: ' + Ti.App.Properties.getString('image5_name'));
  //debug('category_id: ' + Ti.App.Properties.getString('category_id'));
  //debug('material_id: ' + Ti.App.Properties.getString('material_id'));
  //debug('technic_id: '  + Ti.App.Properties.getString('technic_id'));

  info('propery reset end');
}

// 処理中を伝えるView表示(正方形)
function showIndicatorSquare(that) {
  var loading = Ti.UI.createView({
    width           : 132,
    height          : 132,
    borderRadius    : 5,
    opacity         : 0.8,
    backgroundColor : Ti.App.config.overlay_color_dark
  });
  that.add(loading);

  var activityIndicator = Ti.UI.createActivityIndicator({
    style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
  });
  loading.add(activityIndicator);
  activityIndicator.font    = {fontSize:14};
  activityIndicator.color   = 'white';
  activityIndicator.message = '読み込み中...';
  activityIndicator.show();

  return loading;
}

// 処理中を伝えるView表示
function showIndicator(that, message) {
  var loading = Ti.UI.createView({
    width   : Ti.UI.FILL,
    height  : Ti.UI.FILL,
    opacity : 0.6
  });
  loading.backgroundColor = Ti.App.config.cooboo_backgroundColor;
  that.add(loading);

  var activityIndicator = Ti.UI.createActivityIndicator({
    message : message,
    style   : Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
    font    : {
      fontSize : 16
    }
  });
  loading.add(activityIndicator);
  activityIndicator.show();

  return loading;
}

// ネットワークのメモリリーク回避
function XhrMemFree(xhr) {
  xhr.onload = null;
  xhr.onreadystatechange = null;
  xhr.ondatastream = null;
  xhr.onerror = null;
  xhr = null;
}
*/
function info(obj) {
  return Ti.API.info(obj);
}

function debug(obj) {
  return Ti.API.debug(obj);
}

// objectを再帰的に表示
function dump(obj) {
  mylog = [];
  function getIndent(num) {
    var ind = [];
    while(num) {
      ind.push('  ');
      num--;
    }
    return ind.join('');
  }
  function addLog(txt, defaultIndent) {
    var cnt = defaultIndent;
    // array
    if ((typeof txt === 'object') && (txt instanceof Array)) {
      cnt++;
      mylog.push('[');
      for (var i = 0; i < txt.length; i++) {
        mylog.push('\r\n' + getIndent(cnt));
        addLog(txt[i], cnt);
        if (i != txt.length - 1) {
          mylog.push(',');
        }
      }
      mylog.push('\r\n' + getIndent(cnt - 1) + ']');
    // object
    } else if ((typeof txt === 'object')) {
      cnt++;
      mylog.push('{');
      for (var i in txt) {
        mylog.push('\r\n' + getIndent(cnt) + i + ':');
        addLog(txt[i], cnt);
        mylog.push(',');
      }
      mylog.pop();
      mylog.push('\r\n' + getIndent(cnt - 1) + '}');
    } else {
      mylog.push(txt);
    }
  }
  addLog(obj, 0);
  debug(mylog.join(''));
};
