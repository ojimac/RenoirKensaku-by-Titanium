#!/usr/bin/env python
# -*- coding: utf-8 -*-

import urllib
import chardet
from pyquery import PyQuery as pq

#urls = [
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?acode=13&count=127',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=1&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=2&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=3&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=4&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=5&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=6&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=7&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=8&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=9&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=10&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=11&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=12&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#  'http://standard.navitime.biz/renoir/AroundMapSearch.act?page=13&count=127&acode=13&cond=0.0.0.0.0.0&isDefaultSearch=false',
#]

urls = ['http://standard.navitime.biz/renoir/AroundMapSearch.act?acode=13&count=127']

if __name__ == '__main__':
  detected = []
  for url in urls:
    data = ''.join(urllib.urlopen(url).readlines())
    guess = chardet.detect(data)
    result = dict(url = url, data = data, **guess)
    detected.append(result)

  result = []
  for p in detected:
    unicoded = p['data'].decode(p['encoding'])
    d = pq(unicoded)
    for item in d.find('.item'):
      shop_name       = pq(item).find('.spotName a').text();
      shop_detail_url = pq(item).find('.spotName a').eq(1).attr.href
      address         = pq(item).find('.f12s').eq(0).text()
      tel             = pq(item).find('.f12s').eq(1).text()
      print shop_name
      print 'http://standard.navitime.biz/renoir/' + shop_detail_url
      print address
      print tel
      print '----'
