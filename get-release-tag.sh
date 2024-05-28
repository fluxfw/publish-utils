#!/usr/bin/env sh

set -e

root_folder="`dirname "$(realpath "$0")"`"

echo -n "v`$root_folder/HOST_PATH/$(basename "$(realpath "$root_folder")")-get-release-version "$@"`"
