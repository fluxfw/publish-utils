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
application_id_env="`echo "${application_id^^}" | tr - _`"
host="${PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
user="${PUBLISH_DOCKER_USER:=fluxfw}"
image="$host_with_slash$user/$application_id"
version="`$root_folder/../HOST_PATH/$application_id-get-release-tag "$root_folder/.."`"

path_host="`realpath "$path"`"
path_volume="/host/`basename "$path_host"`"

docker run --rm -u "`id -u`:`id -g`" -v "$path_host:$path_volume:ro" -v "`printenv "${application_id_env}_GITHUB_TOKEN_FILE"`:/run/secrets/$application_id-github-token:ro" -e "${application_id_env}_GITHUB_TOKEN_FILE=/run/secrets/$application_id-github-token" --entrypoint "$application_id-create-github-release" "$image:$version" "--path=$path_volume" "$@"
