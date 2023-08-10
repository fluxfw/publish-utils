#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."
libs="$root/.."

checkAlreadyInstalled() {
    if [ `ls "$libs" | wc -l` != "1" ]; then
        echo "Already installed" >&2
        exit 1
    fi
}

installLibrary() {
    (mkdir -p "$libs/$1" && cd "$libs/$1" && wget -O - "$2" | tar -xz --strip-components=1)
}

checkAlreadyInstalled

installLibrary flux-config-api https://github.com/fluxfw/flux-config-api/archive/refs/tags/v2023-06-08-1.tar.gz

installLibrary flux-http-api https://github.com/fluxfw/flux-http-api/archive/refs/tags/v2023-06-19-1.tar.gz

installLibrary flux-pwa-generator https://github.com/fluxfw/flux-pwa-generator/archive/refs/tags/v2023-08-07-2.tar.gz

installLibrary flux-shutdown-handler https://github.com/fluxfw/flux-shutdown-handler/archive/refs/tags/v2023-03-16-1.tar.gz

installLibrary mime-db https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz
