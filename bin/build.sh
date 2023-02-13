#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."
local_bin="$root/.local/bin"

name="`basename "$(realpath "$root")"`"
user="${FLUX_PUBLISH_DOCKER_USER:=fluxfw}"
image="$user/$name"
tag="`$local_bin/get-release-tag.sh "$root"`"

docker build "$root" --pull -t "$image:$tag" -t "$image:latest"
