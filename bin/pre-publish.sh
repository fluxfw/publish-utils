#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."
local_bin="$root/.local/bin"

name="`basename "$(realpath "$root")"`"
user="${FLUX_PUBLISH_DOCKER_USER:=fluxfw}"
image="$user/$name"
tag="`$local_bin/get-release-tag.sh "$root"`"

#"$bin/lint.sh"

"$local_bin/update-release-version.sh" "$root"

path_volume="/code/$name"
new_tag="$(docker run --rm --network none -u "`id -u`":"`id -g`" -v "$root":"$path_volume" "$image:$tag" update-get-release-tag "$path_volume")"

docker build "$root" --pull -t "$image:$new_tag" -t "$image:latest"
