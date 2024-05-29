#!/usr/bin/env sh

set -e

root_folder="`dirname "$0"`"

application_id="`basename "$(realpath "$root_folder/..")"`"
host="${PUBLISH_DOCKER_HOST:=}"
host_with_slash="${host}${host:+/}"
user="${PUBLISH_DOCKER_USER:=fluxfw}"
image="$host_with_slash$user/$application_id"
version="`$root_folder/../HOST_PATH/$application_id-get-release-tag "$root_folder/.."`"

rm -rf "$root_folder/temp" && mkdir -p "$root_folder/temp"

placeholder_files=Dockerfile
for file in $placeholder_files; do
    sed "s/%APPLICATION_ID%/$application_id/g" "$root_folder/$file" > "$root_folder/temp/$file" && chmod "`stat -c %a "$root_folder/$file"`" "$root_folder/temp/$file"
done

(cd "$root_folder/temp" && echo "../../src
../.dockerignore
../../build.mjs
../../create-github-release.mjs
Dockerfile
../../get-release-changelog.mjs
../../get-release-description.mjs
../../get-release-title.mjs
../../install-libraries.sh
../../update-release-version.mjs
../../upload-asset-to-github-release.mjs" | tar -czT -) > "$root_folder/temp/$application_id-$version.tar.gz"

for file in $placeholder_files; do
    unlink "$root_folder/temp/$file"
done

docker build - --pull -t "$image:$version" -t "$image:latest" < "$root_folder/temp/$application_id-$version.tar.gz"

rm -rf "$root_folder/temp"
