#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

application_id="`basename "$(realpath "$root_folder/..")"`"
host="${PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
user="${PUBLISH_DOCKER_USER:=fluxfw}"
image="$host_with_slash$user/$application_id"
version="`$root_folder/../HOST_PATH/$application_id-get-release-tag "$root_folder/.."`"

rm -rf "$root_folder/tmp" && mkdir -p "$root_folder/tmp"

sed "s/%APPLICATION_ID%/$application_id/g" "$root_folder/Dockerfile" > "$root_folder/tmp/Dockerfile"

(cd "$root_folder/tmp" && echo "../../src
../.dockerignore
../../build.mjs
../../create-github-release.mjs
Dockerfile
../../get-release-changelog.mjs
../../get-release-description.mjs
../../get-release-title.mjs
../../install-libraries.sh
../../update-release-version.mjs
../../upload-asset-to-github-release.mjs" | tar -czT -) > "$root_folder/tmp/$application_id-$version.tar.gz"

unlink "$root_folder/tmp/Dockerfile"

docker build - --pull -t "$image:$version" -t "$image:latest" < "$root_folder/tmp/$application_id-$version.tar.gz"

rm -rf "$root_folder/tmp"
