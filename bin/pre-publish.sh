#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."

#"$bin/lint.sh"

"$bin/HOST_PATH/update-release-version" "$root"

"$bin/build.sh"
