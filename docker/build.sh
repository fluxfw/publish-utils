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

for file in ../application ../library .dockerignore ../build.mjs Dockerfile ../install-libraries.sh ../package.json ../package-lock.json; do
    cp -rp "$root_folder/$file" "$root_folder/temp"
done

sed -i "s/%APPLICATION_ID%/$application_id/g;s/%INSTALL_LIBRARIES%/$(cd "$root_folder/../library" && for library in *; do echo -n "COPY \"library\/$library\/package.json\" \"\/build\/$application_id\/library\/$library\/package.json\"\n"; done)/g" "$root_folder/temp/Dockerfile"

docker buildx build "$root_folder/temp" --pull -t "$image:$version" -t "$image:latest"

rm -rf "$root_folder/temp"
