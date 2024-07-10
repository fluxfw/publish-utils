#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

if [ -e "$root_folder/node_modules" ]; then
    echo Already installed! >&2
    exit 1
fi

if [ -e "$root_folder/package-lock.json" ]; then
    unlink "$root_folder/package-lock.json"
fi

(cd "$root_folder" && npm install --prefix . --package-lock-only --no-audit --no-fund)
