#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

if [ -e "$root_folder/node_modules" ]; then
    echo Already installed! >&2
    exit 1
fi

(cd "$root_folder" && npm clean-install --prefix . --no-audit --no-fund)
