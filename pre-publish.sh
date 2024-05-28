#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

#"$root_folder/lint.sh"

"$root_folder/HOST_PATH/`basename "$(realpath "$root_folder")"`-update-release-version" "$root_folder"

"$root_folder/build.sh"
