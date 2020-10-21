<?php

$yml = file_get_contents(__DIR__ . "/auto_version_tag_ci.yml");
$php = file_get_contents(__DIR__ . "/auto_version_tag_ci.php");

$build = str_replace("%BASE64_PHP%", base64_encode(ltrim(trim($php),"<?php")), $yml);

mkdir(__DIR__ . "/../build", null, true);
file_put_contents(__DIR__ . "/../build/auto_version_tag_ci.yml", $build);
