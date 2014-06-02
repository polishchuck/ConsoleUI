<?php
$url = $_GET['url'];
echo $url,'<br />';
$url = str_replace('\\\\', '?', $url);
echo $url,'<br />';
$url = str_replace('\\', '&', $url);
echo $url,'<br />';
echo $resp = file_get_contents($url);
print_r(json_decode($resp));
//echo mb_convert_encoding($resp, "utf-8", "windows-1251");

 