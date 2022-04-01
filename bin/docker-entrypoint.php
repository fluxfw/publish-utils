#!/usr/bin/env php
<?php

require_once __DIR__ . "/../autoload.php";

use FluxPublishUtils\PublishUtils;

PublishUtils::new()
    ->run();
