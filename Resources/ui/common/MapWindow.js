Ti.include('etc/util.js');

function MapWindow(_title) {
  var self = Ti.UI.createWindow({
    title           : _title,
    tabBarHidden    : true,
    navBarHidden    : true,
    backgroundColor : 'white'
  });

  Ti.API.debug("serverRoot: " + Ti.App.config.serverRoot);
  Ti.UI.setBackgroundColor('#fff');

  var mapview;
  var activityIndicator;
  var latitude  = 35.659371;
  var longitude = 139.701033;
  var get_location, get_all_renoir;

  // スピナー
  activityIndicator = Ti.UI.createActivityIndicator({
    message    : '読み込み中...',
    style      : Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
    top        : 150,
    left       : 100,
    height     : Ti.UI.SIZE,
    width      : Ti.UI.SIZE
  });
  self.add(activityIndicator);

  // ウィンドウオープン
  self.addEventListener('open', function() {
    // ローディング表示
    activityIndicator.show();
    // ローディング消す
    setTimeout(function(e) {
      //e.source.close();
      activityIndicator.hide();
    }, 6000);

    // Make sure we only add the map once
    if (mapview !== undefined) {
      return;
    }

    // 現在位置取得
    get_location();

    // map ビュー
    mapview = Ti.Map.createView({
      mapType        : Ti.Map.STANDARD_TYPE,
      region         : {
        latitude       : latitude,
        longitude      : longitude,
        latitudeDelta  : 0.01,
        longitudeDelta : 0.10
      },
      animate        : true,
      regionFit      : true,
      userLocation   : true
    });

    // ルノアールの位置を取得してピンを立てる(複数)
    info = get_all_renoir(mapview);
    //Ti.API.info(info);

    mapview.addEventListener('click', function(e) {
      dump(e);
      //Ti.API.info('shops click');
      //Ti.API.info(shops);
      //Ti.API.info('^ shops info');
      var annotation = e.annotation;
      var title = e.title;
      var clicksource = e.clicksource;
      var myid = (e.annotation) ? e.annotation.myid : -1;

      Ti.API.info('mapview click clicksource = ' + clicksource);
      if (
        e.annotation &&
        (
          e.clicksource === 'leftButton' ||
          e.clicksource === 'leftPane'
        )
      ) {
        mapview.removeAnnotation(e.annotation);
      }

      // DISCLOSUREが押された場合
      if (e.annotation && e.clicksource === 'rightButton') {
        Ti.API.debug('annotation');
        Ti.API.debug(e.annotation.titleid);
        Ti.API.debug(e.annotation.subtitleid);
        var ShopDetailWindow = require('ui/common/ShopDetailWindow');
        var ShopDetailWin = new ShopDetailWindow({
          _title : title,
          _url   : annotation.subtitle
        });
        ShopDetailWin.open();
        var t = Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT;
        self.animate({view:ShopDetailWin, transition:t});
      }
    });

    // 現在地を取得するボタン
    button = Ti.UI.createButton({
      title  : '現在地に移動',
      top    : 10,
      width  : 120,
      height : 30
    });

    button.addEventListener('click', function() {
      get_location();
    });
    mapview.add(button);
  });

  // 現在位置を取得してスクロール
  get_location = function() {
    Ti.Geolocation.getCurrentPosition(function(e) {
      // 緯度・経度
      var longitude = e.coords.longitude;
      var latitude  = e.coords.latitude;

      // 隠していた地図を表示する
      mapview.show();
      // 現在地まで地図をスクロールする
      mapview.setLocation({
        latitude       : latitude,
        longitude      : longitude,
        latitudeDelta  : 0.01,
        longitudeDelta : 0.01
      });
    });
  };

  // ルノアールを検索して、ピンを立てる
  get_all_renoir = function(mapview) {
    var url = Ti.App.config.serverRoot + '/shops.json';
    var xhr = Ti.Network.createHTTPClient();
    xhr.timeout = 100000;
    xhr.open('GET', url);
    xhr.onerror = function(e) {
      Ti.API.debug(e.error);
      return alert(e.error);
    };
    xhr.onload = function() {
      var results = [];
      var json = JSON.parse(this.responseText);
      var counter = json.length;

      for (var i = 0; i < counter; i++) {
        var info = json[i];

        results.push(Ti.Map.createAnnotation({
          animate     : true,
          pincolor    : Ti.Map.ANNOTATION_RED,
          title       : info.name,
          subtitle    : info.shop_detail_url,
          latitude    : info.lat,
          longitude   : info.lng,
          rightButton : Ti.UI.iPhone.SystemButton.DISCLOSURE,
          titleid     : info.id,
          subtitleid  : info.id
        }));
      }
      mapview.addAnnotations(results);
      // 隠していた地図を表示する
      mapview.show();
      // 現在地まで地図をスクロールする
      mapview.setLocation({
        latitude       : latitude,
        longitude      : longitude,
        latitudeDelta  : 0.01,
        longitudeDelta : 0.01
      });
      self.add(mapview);
      //shops = info;
      //Ti.API.info(shops);
    };
    xhr.send();
  };

  return self;
}

module.exports = MapWindow;
