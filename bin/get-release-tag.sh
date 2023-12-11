#!/usr/bin/env sh

set -e

bin="`dirname "$(realpath "$0")"`"

echo -n "v`$bin/HOST_PATH/get-release-version "$@"`"
