#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."
local_bin="$root/.local/bin"

name="`basename "$(realpath "$root")"`"
image="$FLUX_PUBLISH_DOCKER_USER/$name"
tag="`$local_bin/get-release-tag.sh "$root"`"

"$bin/build.sh"

#flux-js-lint "$root"

"$local_bin/tag-release.sh" "$root"
"$local_bin/create-github-release.sh" "$root"

export DOCKER_CONFIG="$FLUX_PUBLISH_DOCKER_CONFIG_FOLDER"
docker push "$image:$tag"
docker push "$image:latest"
unset DOCKER_CONFIG

"$local_bin/update-github-metadata.sh" "$root"
