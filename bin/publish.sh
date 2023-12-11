#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."

name="`basename "$(realpath "$root")"`"
host="${FLUX_PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
image="$host_with_slash$FLUX_PUBLISH_DOCKER_USER/$name"
tag="`$bin/HOST_PATH/get-release-tag "$root"`"

"$bin/build.sh"

"$bin/HOST_PATH/tag-release" "$root"
"$bin/HOST_PATH/create-github-release" "$root"

export DOCKER_CONFIG="$FLUX_PUBLISH_DOCKER_CONFIG_FOLDER"
docker push "$image:$tag"
docker push "$image:latest"
unset DOCKER_CONFIG
