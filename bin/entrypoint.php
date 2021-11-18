#!/usr/bin/env php
<?php

require_once __DIR__ . "/../autoload.php";

use FluxPublishUtils\FluxPublishUtils;

if (php_sapi_name() !== "cli") {
    die();
}

FluxPublishUtils::new()
    ->run();
