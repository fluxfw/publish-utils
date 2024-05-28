#!/usr/bin/env sh

set -e

path="$1"
if [ -z "$path" ]; then
    echo "Please pass a path!" >&2
    exit 1
fi
shift

echo -n "$(<"$path/version")"
