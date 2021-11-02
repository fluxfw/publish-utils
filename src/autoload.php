<?php

namespace FluxPublishUtils;

if (version_compare(PHP_VERSION, ($min_php_version = "8.0"), "<")) {
    die(__NAMESPACE__ . " needs at least PHP " . $min_php_version);
}

foreach (["curl", "json"] as $ext) {
    if (!extension_loaded($ext)) {
        die(__NAMESPACE__ . " needs PHP ext " . $ext);
    }
}
