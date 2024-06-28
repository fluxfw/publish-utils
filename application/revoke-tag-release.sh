#!/usr/bin/env sh

set -e

path="$1"
if [ -z "$path" ]; then
    echo Please pass a path! >&2
    exit 1
fi

root_folder="`dirname "$(realpath "$0")"`"

application_id="`basename "$(realpath "$root_folder/..")"`"

tag="`$root_folder/../HOST_PATH/$application_id-get-release-tag "$path"`"

echo "Revoke git tag $tag"

git -C "$path" tag -d "$tag"

git -C "$path" push -d origin "$tag"
