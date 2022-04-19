#!/usr/bin/env php
<?php

require_once __DIR__ . "/../autoload.php";

use FluxPublishUtils\Adapter\PublishUtils;

PublishUtils::new()
    ->run();
