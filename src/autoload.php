<?php

namespace FluxPublishUtils;

require_once __DIR__ . "/../libs/flux-rest-base-api/autoload.php";

use FluxAutoloadApi\Adapter\Autoload\Psr4Autoload;
use FluxAutoloadApi\Adapter\Checker\PhpExtChecker;
use FluxAutoloadApi\Adapter\Checker\PhpVersionChecker;

PhpVersionChecker::new(
    ">=8.0",
    __NAMESPACE__
)
    ->check();
PhpExtChecker::new(
    [
        "curl",
        "json"
    ],
    __NAMESPACE__
)
    ->check();

Psr4Autoload::new(
    [
        __NAMESPACE__ => __DIR__
    ]
)
    ->autoload();
