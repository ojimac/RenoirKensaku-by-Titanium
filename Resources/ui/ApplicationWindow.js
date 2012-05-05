exports.ApplicationWindow = function() {
  var geo = require('geo');

  // メインウィンドウ
  var self = Ti.UI.createWindow({
    title:'ルノアールマップ',
    backgroundColor:'#fff',
    fullscreen: false,
    exitOnClose: true
  });

  // 上部バー
  var view = Ti.UI.createView({
    backgroundColor: '#800',
    height: '50dp',
    top: 0
  });

  // ボタン
  var button = Ti.UI.createButton({
    title: '現在地から探す',
    font: {
      fontSize: '8dp',
      //fontWeight: 'bold'
    },
    top: '10dp',
    height: '30dp',
    width: '100dp',
    left: '110dp'
  });

  // テキストフィールド
/*
  var textfield = Ti.UI.createTextField({
    height: '40dp',
    width: '245dp',
    top: '5dp',
    left: '70dp',
    style: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    hintText: '探したいルノアールを入力...',
    backgroundColor: '#fff',
    paddingLeft: '5dp'
  });
*/

  var mapview;

  // ウィンドウオープン時
  self.addEventListener('open', function() {
    // Make sure we only add the map once
    if (mapview !== undefined) {
      return;
    }

    // 地図ビュー
    mapview = Ti.Map.createView({
      mapType: Ti.Map.STANDARD_TYPE,
      region: {
        latitude: geo.LATITUDE_BASE,
        longitude: geo.LONGITUDE_BASE,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03
      },
      animate: true,
      regionFit: true,
      userLocation: true,
      top: '50dp'
    });

    // 位置情報を使う事をアラートで示す
    mapview.addAnnotation(Ti.Map.createAnnotation({
      animate: true,
      pincolor: Ti.Map.ANNOTATION_RED,
      title: '現在位置',
      latitude: geo.LATITUDE_BASE,
      longitude: geo.LONGITUDE_BASE,
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
    self.add(mapview);
  });

  // 「現在地から探す」ボタンを押したとき
  button.addEventListener('click', function(e) {
    Ti.Geolocation.purpose = 'サンプル';

    Ti.Geolocation.getCurrentPosition(
      function(e) {
        if (!e.success || e.error) {
          alert('位置情報が取得できませんでした');
          return;
        }

        var latitude = e.coords.latitude;
        var longitude = e.coords.longitude;

        // ピンを立てる
        var currentPos = Ti.Map.createAnnotation({
          latitude: latitude,
          longitude: longitude,
          title:"現在地",
          pincolor:Ti.Map.ANNOTATION_RED,
          animate:true
        });
        mapview.addAnnotation(currentPos);
        mapview.show();       // 隠していた地図を表示する
        mapview.setLocation({ // 現在地まで地図をスクロールする
          latitude:latitude,
          longitude:longitude,
          latitudeDelta:0.01,
          longitudeDelta:0.01
        });
      }
    );
  });

  view.add(button);
  self.add(view);

  return self;
}
