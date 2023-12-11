#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."

name="`basename "$(realpath "$root")"`"
host="${FLUX_PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
user="${FLUX_PUBLISH_DOCKER_USER:=fluxfw}"
image="$host_with_slash$user/$name"
tag="`$bin/HOST_PATH/get-release-tag "$root"`"

docker build "$root" --pull -t "$image:$tag" -t "$image:latest"
