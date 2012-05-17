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

    // 位置情報を使う事をアラートで示す
    mapview.addAnnotation(Ti.Map.createAnnotation({
      animate: true,
      pincolor: Ti.Map.ANNOTATION_RED,
      title: '現在位置',
      latitude: latitude,
      longitude: longitude,
      leftButton: '/images/delete.png'
    }));

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

    // ピンを立てる
    var currentPos = Ti.Map.createAnnotation({
      latitude: latitude,
      longitude: longitude,
      title:"現在地",
      pincolor:Ti.Map.ANNOTATION_RED,
      animate:true
    });
    mapview.addAnnotation(currentPos);
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
