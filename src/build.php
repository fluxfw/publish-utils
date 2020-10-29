<?php

//require_once __DIR__ . "/../vendor/autoload.php";

$yml_code = file_get_contents(__DIR__ . "/auto_version_tag_ci.yml");

$php_code = trim(exec("php -w " . escapeshellarg(__DIR__ . "/auto_version_tag_ci.php")));

$encode = ["%", '"', "'", "$", ":"];

$build_code = str_replace("%ENCODED_PHP_CODE%", str_replace($encode, array_map("rawurlencode", $encode), $php_code), $yml_code);

mkdir(__DIR__ . "/../build", null, true);
file_put_contents(__DIR__ . "/../build/auto_version_tag_ci.yml", $build_code);
