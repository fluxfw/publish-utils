#!/usr/bin/env sh

set -e

path="$1"
if [ -z "$path" ]; then
    echo "Please pass a path!" >&2
    exit 1
fi
shift

bin_folder="`dirname "$(realpath "$0")"`"
root_folder="$bin_folder/.."

name="`basename "$(realpath "$root_folder")"`"
host="${PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
user="${PUBLISH_DOCKER_USER:=fluxfw}"
image="$host_with_slash$user/$name"
tag="`$bin_folder/HOST_PATH/get-release-tag "$root_folder"`"

path_host="`realpath "$path"`"
path_volume="/host/`basename "$path_host"`"

docker run --rm -u "`id -u`":"`id -g`" -v "$path_host":"$path_volume":ro -v "$PUBLISH_UTILS_GITHUB_TOKEN_FILE":/run/secrets/publish_utils_github_token:ro -e PUBLISH_UTILS_GITHUB_TOKEN_FILE=/run/secrets/publish_utils_github_token "$image:$tag" "$path_volume" "$@"
