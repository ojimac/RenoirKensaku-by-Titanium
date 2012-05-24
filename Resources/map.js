var mapview, activityIndicator;
var latitude  = 35.659371;
var longitude = 139.701033;

win = Ti.UI.currentWindow;

// ローディング画像
activityIndicator = Ti.UI.createActivityIndicator({
  color: '',
  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
  message: '読込中...',
  style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
  top:150,
  left:100,
  height:'auto',
  width:'auto'
});
win.add(activityIndicator);

// ウィンドウオープン
win.addEventListener('open', function() {

  activityIndicator.show();
  setTimeout(function(e) {
    e.source.close();
    activityIndicator.hide();
  }, 6000);

  // Make sure we only add the map once
  if (mapview !== undefined) {
    return;
  }

  // 現在位置を取得
  get_location();

  // map ビュー
  mapview = Ti.Map.createView({
    mapType: Ti.Map.STANDARD_TYPE,
    region: {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.10
    },
    animate: true,
    regionFit: true,
    userLocation: true,
  });

  Ti.Geolocation.getCurrentPosition(function(e) {

    // 緯度・経度
    var longitude = e.coords.longitude;
    var latitude = e.coords.latitude;


    // ルノアールの位置取得
    annotations = get_all_renoir();

    // ピンを立てる(複数)
    mapview.addAnnotations(annotations);

    // アラートを出したときに、左側の「設定」が押されたかどうか
    mapview.addEventListener('click', function(e) {
      if (e.annotation
          && (
                  e.clicksource === 'leftButton'
               || e.clicksource === 'leftPane'
             )
      ) {
        mapview.removeAnnotation(e.annotation);
      }
    });

    // 隠していた地図を表示する
    mapview.show();
    // 現在地まで地図をスクロールする
    mapview.setLocation({
      latitude:latitude,
      longitude:longitude,
      latitudeDelta:0.01,
      longitudeDelta:0.01
    });

    /*
    // TODO: 近くにあるルノアールを検索して、ピンを立てる
    mapview.addEventListener('regionChanged', function(e) {
      // 表示領域が変わったときのイベント（移動・拡大縮小）
      Ti.API.info('mapview redionChanged...');
      Ti.API.info('the new latitude = ' + e.latitude);
      Ti.API.info('the new latitude delta = ' + e.latitudeDelta);
      Ti.API.info('the new longitude = ' + e.longitude);
      Ti.API.info('the new longitude delta = ' + e.longitudeDelta);
    });
    */
    win.add(mapview);

    // 現在地を取得するボタン
    button = Titanium.UI.createButton({
     title: '現在地',
     top: 10,
     width: 100,
     height:25
    });

    button.addEventListener('click', function() {
      get_location();
    });
    win.add(button);
  });
});

// 現在位置を取得してスクロール
var get_location = function() {
  Ti.Geolocation.getCurrentPosition(function(e) {
    // 緯度・経度
    var longitude = e.coords.longitude;
    var latitude = e.coords.latitude;

    // 隠していた地図を表示する
    mapview.show();
    // 現在地まで地図をスクロールする
    mapview.setLocation({
      latitude:latitude,
      longitude:longitude,
      latitudeDelta:0.01,
      longitudeDelta:0.01
    });
  });
};

// ルノアールを検索して、ピンを立てる
var get_all_renoir = function() {
  var db = Titanium.Database.open('mydb');
  var results = [];
  db.execute('SELECT * FROM shops');
  var rows = db.execute('SELECT * FROM shops');
  while (rows.isValidRow()) {
    results.push(Ti.Map.createAnnotation({
      animate: true,
      pincolor: Ti.Map.ANNOTATION_RED,
      title: rows.fieldByName('name'),
      latitude: rows.fieldByName('lat'),
      longitude: rows.fieldByName('lng'),
      leftButton: '/images/delete.png'
    }));
    rows.next();
  }
  rows.close();
  db.close();
  return results;
}
