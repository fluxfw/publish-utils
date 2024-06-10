#!/usr/bin/env sh

set -e

path="$1"
if [ -z "$path" ]; then
    echo Please pass a path! >&2
    exit 1
fi
shift

root_folder="`dirname "$(realpath "$0")"`"

application_id="`basename "$(realpath "$root_folder/..")"`"
host="${PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
user="${PUBLISH_DOCKER_USER:=fluxfw}"
image="$host_with_slash$user/$application_id"
version="`$root_folder/../HOST_PATH/$application_id-get-release-tag "$root_folder/.."`"

path_host="`realpath "$path"`"
path_volume="/host/`basename "$path_host"`"

docker run --rm --network none -u "`id -u`:`id -g`" -v "$path_host:$path_volume:ro" --entrypoint "$application_id-get-release-title" "$image:$version" "--path=$path_volume" "$@"
