var win;
var mapview;
var activityIndicator;
var latitude  = 35.659371;
var longitude = 139.701033;
var get_location, get_all_renoir;

win = Ti.UI.currentWindow;

// ローディング画像
activityIndicator = Ti.UI.createActivityIndicator({
  color      : '',
  font       : {
    fontFamily : 'Helvetica Neue',
    fontSize   : 26,
    fontWeight : 'bold'
  },
  message    : '読込中...',
  style      : Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
  top        : 150,
  left       : 100,
  height     : 'auto',
  width      : 'auto'
});
win.add(activityIndicator);

// ウィンドウオープン
win.addEventListener('open', function() {
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
  get_all_renoir(mapview);

  // アラートを出したときに、左側の「設定」が押されたかどうか
  mapview.addEventListener('click', function(e) {
    if (
      e.annotation &&
      (
        e.clicksource === 'leftButton' ||
        e.clicksource === 'leftPane'
      )
    ) {
      mapview.removeAnnotation(e.annotation);
    }
    Ti.API.info('title: ' + e.title);
    Ti.API.info('id: ' + e.annotation.myid);
  });

  // 現在地を取得するボタン
  button = Titanium.UI.createButton({
   title  : '現在地に移動',
   top    : 10,
   width  : 120,
   height : 30
  });

  button.addEventListener('click', function() {
    get_location();
  });
  win.add(button);
});

// 現在位置を取得してスクロール
get_location = function() {
  Ti.Geolocation.getCurrentPosition(function(e) {
    // 緯度・経度
    var longitude = e.coords.longitude;
    var latitude = e.coords.latitude;

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
        animate    : true,
        pincolor   : Ti.Map.ANNOTATION_RED,
        title      : info.name,
        latitude   : info.lat,
        longitude  : info.lng,
        leftButton : '/images/delete.png',
        myid       : info.id
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

  win.add(mapview);

  };
  xhr.send();
};
