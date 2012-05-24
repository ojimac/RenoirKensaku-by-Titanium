#!/usr/bin/env python
# -*- coding: utf-8 -*-

import chardet
import urllib
import sqlite3
from googlemaps import GoogleMaps
from pyquery import PyQuery as pq

urls = [
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?acode=13&count=127',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=1&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=2&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=3&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=4&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=5&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=6&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=7&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=8&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false', #TODO: 銀座西1-2あり
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=9&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=10&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=11&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=12&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=13&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
]

#urls = ['http://standard.navitime.biz/renoir/AroundMapSearch.act?acode=13&count=127']

sqlite_path = '/Users/ojimac/Library/Application Support/iPhone Simulator/5.0/Applications/8FC498B1-D358-4AD9-AB6F-9326B4095AA0/Library/Private Documents/mydb.sql'

if __name__ == '__main__':
  detected = []
  for url in urls:
    data = ''.join(urllib.urlopen(url).readlines())
    guess = chardet.detect(data)
    result = dict(url = url, data = data, **guess)
    detected.append(result)

  print 'get url complete'

  # gmap
  gmaps = GoogleMaps()
  # sqlite
  conn = sqlite3.connect(sqlite_path)
  db = conn.cursor()
  for p in detected:
    unicoded = p['data'].decode(p['encoding'])
    d = pq(unicoded)
    for item in d.find('.item'):
      shop_name = pq(item).find('.spotName a').text();
      tel       = pq(item).find('.f12s').eq(1).text()
      address   = pq(item).find('.f12s').eq(0).text()
      address   = address.split()
      print address
      # 銀座西1-2は除く
      if address[0] != u'\u6771\u4eac\u90fd\u4e2d\u592e\u533a\u9280\u5ea7\u897f1-2':
        lat, lng        = gmaps.address_to_latlng(address[0].encode('utf-8'))
        shop_detail_url = pq(item).find('.spotName a').eq(1).attr.href
        shop_detail_url = 'http://standard.navitime.biz/renoir/' + shop_detail_url 
        t = [shop_name, tel, lat, lng, address[0], shop_detail_url]
        try:
          db.execute('insert into shops values (null, ?, ?, ?, ?, ?, ?)', t) 
        except sqlite3.ProgrammingError as e:
          print e
        print 'commit'
        print '-----'
  conn.commit()
  db.close()
