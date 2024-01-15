#!/usr/bin/env sh

set -e

bin_folder="`dirname "$0"`"
root_folder="$bin_folder/.."

#"$bin_folder/lint.sh"

"$bin_folder/HOST_PATH/update-release-version" "$root_folder"

"$bin_folder/build.sh"
