#!/usr/bin/php
<?php
error_reporting(-1);
require_once 'htmlSQL/snoopy.class.php';
require_once 'htmlSQL/htmlsql.class.php';

$wsql = new htmlsql();

$pdo = new PDO('sqlite:/Users/ojimac/Dropbox/heroku/renoir/db/my.db');
$sql = 'select * from shops';
$results = array();
foreach ($pdo->query($sql) as $row) {
	$results[$row['id']] = $row['shop_detail_url'];
}

foreach ($results as $result) {
	echo 'url: ' . $result . "\n";
	if (!$wsql->connect('url', $result)) {
		print 'Query error' . $wsql->error;
		exit;
	} else {
		if (!$wsql->query('SELECT * FROM div WHERE preg_match("/detail/", $class)')) {
			print "Query error: " . $wsql->error;
			exit;
		}

		foreach ($wsql->fetch_objects() as $k => $obj) {
			//echo 'key is ' . $k . "\n";
			//echo  mb_convert_encoding($obj->text, 'UTF-8', 'SJIS-win') . "\n";
			//echo '-----' . "\n";

			if ($k === 4) { // 営業時間
				mb_convert_encoding($obj->text, 'UTF-8', 'SJIS-win');
			}

			if ($k === 6) { // 禁煙席
			}

			if ($k === 8) { // 喫煙席
			}

			if ($k === 10) { // アクセス
			}

			if ($k === 12) { // 備考
			}

			if ($k === 14) { // 施設情報
			}
		}
		//break;
	}
}
