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
    dest="$libs/$1"

    while true; do 
        rm -rf "$dest" && mkdir -p "$dest"

        wget -T 5 -O "$dest.tar.gz" "$2" && true

        if [ "$?" = "0" ] && [ -f "$dest.tar.gz" ]; then
            (cd "$dest" && tar -xzf "$dest.tar.gz" --strip-components=1)
            unlink "$dest.tar.gz"

            if [ `ls "$dest" | wc -l` != "0" ]; then
                sleep 2
                break
            fi
        fi

        sleep 10
    done
}

checkAlreadyInstalled

installLibrary flux-config https://github.com/fluxfw/flux-config/archive/refs/tags/v2023-11-16-1.tar.gz

installLibrary flux-http-api https://github.com/fluxfw/flux-http-api/archive/refs/tags/v2023-10-30-2.tar.gz

installLibrary flux-pwa-generator https://github.com/fluxfw/flux-pwa-generator/archive/refs/tags/v2023-09-25-1.tar.gz

installLibrary flux-shutdown-handler https://github.com/fluxfw/flux-shutdown-handler/archive/refs/tags/v2023-03-16-1.tar.gz

installLibrary mime-db https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz
