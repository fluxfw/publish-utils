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

installArchiveLibrary() {
    dest="$libs/$1"

    echo "Install archive library $2 to $dest"

    while true; do 
        rm -rf "$dest" && mkdir -p "$dest"

        wget -T 5 -O "$dest.tar.gz" "$2" && true

        if [ "$?" = "0" ] && [ -f "$dest.tar.gz" ]; then
            (cd "$dest" && tar -xzf "$dest.tar.gz" --strip-components=1)
            unlink "$dest.tar.gz"

            if [ `ls "$dest" | wc -l` != "0" ]; then
                break
            fi
        fi

        sleep 10
    done
}

installNpmLibrary() {
    dest="$libs/$1"
    dest_node_modules="$libs/node_modules/$1"

    echo "Install npm library $1@$2 to $dest_node_modules"

    mkdir -p "$dest"
    (cd "$dest" && npm install --prefix . --no-save --omit=dev --omit=optional --omit=peer "$1@$2")

    mkdir -p "`dirname "$dest_node_modules"`"
    mv "$dest/node_modules/$1" "$dest_node_modules"
    mv "$dest/node_modules" "$dest_node_modules/node_modules"
    rmdir "$dest"
}

checkAlreadyInstalled

installArchiveLibrary flux-config https://github.com/fluxfw/flux-config/archive/refs/tags/v2023-11-16-1.tar.gz

installArchiveLibrary flux-pwa-generator https://github.com/fluxfw/flux-pwa-generator/archive/refs/tags/v2023-12-18-1.tar.gz

installArchiveLibrary flux-shutdown-handler https://github.com/fluxfw/flux-shutdown-handler/archive/refs/tags/v2023-03-16-1.tar.gz

installNpmLibrary mime-db 1.52.0

installNpmLibrary uglify-js 3.17.4
