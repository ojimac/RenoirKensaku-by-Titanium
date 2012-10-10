Ti.include('etc/util.js');

function MapWindow(_title) {
  var self = Ti.UI.createWindow({
    title           : _title,
    navBarHidden    : true,
    backgroundColor : '#fff'
  });

  // default shibuya
  var latitude  = 35.659371;
  var longitude = 139.701033;

  var loadingview = Ti.UI.createView({
    width  : Ti.UI.FILL,
    height : Ti.UI.FILL
  });
  var loading_indicator = Ti.UI.createActivityIndicator({
    style   : Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
    color   : 'black',
    message : '読み込み中...',
    font    : {
      fontSize : 14
    }
  });
  loadingview.add(loading_indicator);
  self.add(loadingview);

  var mapview = Ti.Map.createView({
    mapType      : Ti.Map.STANDARD_TYPE,
    animate      : true,
    regionFit    : true,
    userLocation : true,
    region       : {
      latitude       : latitude,
      longitude      : longitude,
      latitudeDelta  : 0.01,
      longitudeDelta : 0.10
    }
  });

  self.addEventListener('open', function() {
    loading_indicator.show();

    // 現在位置取得
    get_location();

    // ルノアールの位置を取得してピンを立てる(複数)
    var info = get_all_renoir(mapview);

    mapview.addEventListener('click', function(e) {
      var annotation = e.annotation;
      var title = e.title;
      var clicksource = e.clicksource;
      var myid = (e.annotation) ? e.annotation.myid : -1;

      if (
        e.annotation &&
        e.clicksource === 'leftPane'
      ) {
        mapview.removeAnnotation(e.annotation);
      }

      if (e.annotation && e.clicksource === 'rightButton') {
        var ShopDetailWindow = Ti.UI.createWindow({
          title           : '店舗詳細',
          backButtonTitle : '戻る',
          navBarHidden    : false,
          backgroundColor : '#ffffff'
        });
        var ShopDetailView = require('ui/common/ShopDetailView');
        var ShopDetail = new ShopDetailView({
          _url : annotation.titleid
        });
        ShopDetailWindow.add(ShopDetail);
        self.nav.open(ShopDetailWindow);
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
  var get_location = function() {
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
  var get_all_renoir = function(mapview) {
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
          animate     : false,
          pincolor    : Ti.Map.ANNOTATION_RED,
          title       : info.name,
          latitude    : info.lat,
          longitude   : info.lng,
          rightButton : Ti.UI.iPhone.SystemButton.DISCLOSURE,
          titleid     : info.shop_detail_url,
        }));
      }
      mapview.addAnnotations(results);
      // 隠していた地図を表示する
      mapview.show();
      loadingview.hide();
      // 現在地まで地図をスクロールする
      mapview.setLocation({
        latitude       : latitude,
        longitude      : longitude,
        latitudeDelta  : 0.01,
        longitudeDelta : 0.01
      });
      self.add(mapview);

      // Ad
      Titanium.Admob  = require('ti.admob');
      var adview = Titanium.Admob.createView({
        bottom             : 0,
        left               : 0,
        right              : 0,
        width              : 320,
        height             : 50,
        adBackgroundColor  : 'black',
        primaryTextColor   : 'blue',
        secondaryTextColor : 'green',
        publisherId        : 'a1507569b1eef04'
      });
      self.add(adview);
    };
    xhr.send();
  };

  return self;
}

module.exports = MapWindow;
