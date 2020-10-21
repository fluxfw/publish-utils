<?php

$yml = file_get_contents(__DIR__ . "/auto_version_tag_ci.yml");
$php = file_get_contents(__DIR__ . "/auto_version_tag_ci.php");

$build = str_replace("%PHP%", escapeshellarg(trim($php)), $yml);

mkdir(__DIR__ . "/../build", null, true);
file_put_contents(__DIR__ . "/../build/auto_version_tag_ci.yml", $build);
