function ShopDetailView(_args) {
  var self = Ti.UI.createView();
  var web_view = Ti.UI.createWebView({
    url    : _args._url,
    height : Ti.UI.SIZE,
    width  : Ti.UI.SIZE
  });
  self.add(web_view);

/*
  var view = Ti.UI.createView({
    top    : 0,
    left   : 0,
    height : Ti.UI.SIZE,
    width  : Ti.UI.SIZE
  });

  var details = [];
  details[0] = Ti.UI.createTableViewSection({
    headerTitle : _args._title
  });

  var name = Ti.UI.createTableViewRow({
    hasChild       : false,
    height         : 44,
    index          : 0,
    selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
    title          : 'renoir~',
    touchEnabled   : false
  });
  details[0].add(name);

  var business_hour = Ti.UI.createTableViewRow({
    hasChild       : false,
    height         : 44,
    index          : 0,
    selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
    title          : '10:00~23:00',
    touchEnabled   : false
  });
  details[0].add(business_hour);

  var table_view = Ti.UI.createTableView({
    top : 0,
    data : details,
    style : Ti.UI.iPhone.TableViewStyle.GROUPED
  });

  view.add(table_view);

  win.add(view);
*/

  return self;
}

module.exports = ShopDetailView;
