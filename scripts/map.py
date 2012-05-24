#!/usr/bin/env python
# -*- coding: utf-8 -*-

from googlemaps import GoogleMaps

gmaps = GoogleMaps()
address = u'東京'
lat, lng = gmaps.address_to_latlng(address.encode('utf-8'))
print lat, lng
