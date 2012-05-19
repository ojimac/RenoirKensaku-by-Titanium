//Ti.include('geo.js');

var geo, mapview, latitude, longitude;

win = Ti.UI.currentWindow;

// ウィンドウオープン
win.addEventListener('open', function() {

  // Make sure we only add the map once
  if (mapview !== undefined) {
    return;
  }

  // 現在位置を取得
  Ti.Geolocation.getCurrentPosition(function(e) {

    // 緯度・経度
    var longitude = e.coords.longitude;
    var latitude = e.coords.latitude;

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

    // TODO: 近くにあるルノアールを検索して、ピンを立てる
    var db = Titanium.Database.open('mydb');
    var results = [];
    db.execute('SELECT * FROM shops');
    var rows = db.execute('SELECT * FROM shops');
    while (rows.isValidRow()) {
      // rows.field(field_no)で値を取得します。
      // カラム名ベースでも取れるみたいです。
      Ti.API.info('ID: ' + rows.field(0) + ' NAME: ' + rows.fieldByName('name'));
      results.push(Ti.Map.createAnnotation({
        animate: true,
        pincolor: Ti.Map.ANNOTATION_RED,
        title: '現在位置',
        latitude: rows.fieldByName('lat'),
        longitude: rows.fieldByName('lon'),
        leftButton: '/images/delete.png'
      }));
      rows.next();
    }
    rows.close();
    db.close();

    // ピンを立てる(複数)
    mapview.addAnnotations(results);

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
  });
});
