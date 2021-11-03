<?php

namespace FluxPublishUtils;

require_once __DIR__ . "/../libs/FluxAutoloadApi/autoload.php";

use FluxAutoloadApi\Adapter\Autoload\PhpExtChecker;
use FluxAutoloadApi\Adapter\Autoload\PhpVersionChecker;

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
