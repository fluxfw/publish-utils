<?php

//require_once __DIR__ . "/../vendor/autoload.php";

$composer_json = json_decode(file_get_contents(getcwd() . "/composer.json"));

$yml_code = file_get_contents(__DIR__ . "/auto_version_tag_ci.yml");

$php_code = trim(exec("php -w " . escapeshellarg(__DIR__ . "/auto_version_tag_ci.php")));

$php_code = str_replace("%COMPOSER_NAME%", $composer_json->name, $php_code);

$encode = ["%", '"', "'", "$", ":"];

$build_code = str_replace("%ENCODED_PHP_CODE%", str_replace($encode, array_map("rawurlencode", $encode), $php_code), $yml_code);

if (!file_exists(__DIR__ . "/../build")) {
    mkdir(__DIR__ . "/../build", 0755, true);
}

file_put_contents(__DIR__ . "/../build/auto_version_tag_ci.yml", $build_code);
