#!/usr/bin/env sh

set -e

path="$1"
if [ -z "$path" ]; then
    echo "Please pass a path" >&2
    exit 1
fi

local_bin="`dirname "$(realpath "$0")"`"
root="$local_bin/../.."

tag="v`echo -n "$(cat "$path/version")"`"

description="`$local_bin/get-release-description.sh "$path"`"

echo "Create git tag $tag"

git -C "$path" tag -a "$tag" -m "$description"

git -C "$path" push origin "$tag"
