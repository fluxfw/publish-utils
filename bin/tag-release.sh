#!/usr/bin/env sh

set -e

path="$1"
if [ -z "$path" ]; then
    echo "Please pass a path!" >&2
    exit 1
fi

bin_folder="`dirname "$(realpath "$0")"`"

tag="`$bin_folder/HOST_PATH/get-release-tag "$path"`"

description="`$bin_folder/HOST_PATH/get-release-description "$path"`"

echo "Create git tag $tag"

git -C "$path" tag -a "$tag" -m "$description"

git -C "$path" push origin "$tag"
