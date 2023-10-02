#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."
local_bin="$root/.local/bin"

#"$bin/lint.sh"

"$local_bin/update-release-version.sh" "$root"

"$bin/build.sh"
