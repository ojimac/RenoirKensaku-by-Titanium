#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sqlite3

sqlite_path = '/Users/ojimac/Library/Application Support/iPhone Simulator/5.0/Applications/8FC498B1-D358-4AD9-AB6F-9326B4095AA0/Library/Private Documents/mydb.sql'
conn = sqlite3.connect(sqlite_path)
db = conn.cursor()
db.execute('select * from shops')

for row in db:
  print row
