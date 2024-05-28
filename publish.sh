#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

application_id="`basename "$(realpath "$root_folder")"`"

"$root_folder/HOST_PATH/$application_id-tag-release" "$root_folder"
"$root_folder/HOST_PATH/$application_id-create-github-release" "$root_folder"

"$root_folder/docker/publish.sh"
