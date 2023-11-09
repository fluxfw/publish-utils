#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."

#"$bin/lint.sh"

"$bin/PATH/host/update-release-version" "$root"

"$bin/build.sh"
