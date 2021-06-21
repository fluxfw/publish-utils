#!/usr/bin/env php
<?php
$yml_code = file_get_contents(__DIR__ . "/../src/FluxPublishUtils.yml");

$php_code = trim(exec("php -w " . escapeshellarg(__DIR__ . "/../src/FluxPublishUtils.php")));

$encode = ["%", '"', "'", "$", ":"];

$build_code = str_replace("%ENCODED_PHP_CODE%", str_replace($encode, array_map("rawurlencode", $encode), $php_code), $yml_code);

if (!file_exists(__DIR__ . "/../build")) {
    mkdir(__DIR__ . "/../build", 0755, true);
}

file_put_contents(__DIR__ . "/../build/FluxPublishUtils.yml", $build_code);

file_put_contents(__DIR__ . "/../build/index.html", "");

copy(__DIR__ . "/../src/FluxDockerRegistryMirrorCiHelper.yml", __DIR__ . "/../build/FluxDockerRegistryMirrorCiHelper.yml");
