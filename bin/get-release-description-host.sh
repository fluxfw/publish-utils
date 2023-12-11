#!/usr/bin/env sh

set -e

path="$1"
if [ -z "$path" ]; then
    echo "Please pass a path" >&2
    exit 1
fi
shift

bin="`dirname "$(realpath "$0")"`"
root="$bin/.."

name="`basename "$(realpath "$root")"`"
host="${FLUX_PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
user="${FLUX_PUBLISH_DOCKER_USER:=fluxfw}"
image="$host_with_slash$user/$name"
tag="`$bin/HOST_PATH/get-release-tag "$root"`"

path_host="`realpath "$path"`"
path_volume="/host/`basename "$path_host"`"

docker run --rm --network none -u "`id -u`":"`id -g`" -v "$path_host":"$path_volume":ro --entrypoint get-release-description "$image:$tag" "$path_volume" "$@"
