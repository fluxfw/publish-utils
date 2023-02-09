#!/usr/bin/env sh

set -e

path="$1"
if [ -z "$path" ]; then
    echo "Please pass a path" >&2
    exit 1
fi
shift

bin="`dirname "$(realpath "$0")"`"
root="$bin/../.."

name="`basename "$(realpath "$root")"`"
user="${FLUX_PUBLISH_DOCKER_USER:=fluxfw}"
image="$user/$name"
tag="`get-release-tag "$root"`"

path_host="`realpath "$path"`"
path_volume="/code/`basename "$path_host"`"

docker run --rm -u "`id -u`":"`id -g`" -v "$path_host":"$path_volume":ro -e "GH_TOKEN=`cat $FLUX_PUBLISH_GH_TOKEN_FILE`" "$image:$tag" create-github-release "$path_volume" "$@"
