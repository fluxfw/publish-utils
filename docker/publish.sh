#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

application_id="`basename "$(realpath "$root_folder/..")"`"
host="${PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
image="$host_with_slash$PUBLISH_DOCKER_USER/$application_id"
version="`$root_folder/../HOST_PATH/$application_id-get-release-tag "$root_folder/.."`"

"$root_folder/build.sh"

export DOCKER_CONFIG="$PUBLISH_DOCKER_CONFIG_FOLDER"
docker push "$image:$version"
docker push "$image:latest"
unset DOCKER_CONFIG
