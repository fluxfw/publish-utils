#!/usr/bin/env sh

set -e

bin_folder="`dirname "$(realpath "$0")"`"

echo -n "v`$bin_folder/HOST_PATH/get-release-version "$@"`"
