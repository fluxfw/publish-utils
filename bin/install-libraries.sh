#!/usr/bin/env sh

set -e

bin_folder="`dirname "$0"`"
root_folder="$bin_folder/.."
node_modules_folder="$root_folder/node_modules"

checkAlreadyInstalled() {
    if [ -d "$node_modules_folder" ]; then
        echo "Already installed" >&2
        exit 1
    fi
}

installArchiveLibrary() {
    dest="$node_modules_folder/$1"

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

checkAlreadyInstalled

installArchiveLibrary flux-build-utils https://github.com/fluxfw/flux-build-utils/archive/refs/tags/v2024-03-20-1.tar.gz

installArchiveLibrary flux-config https://github.com/fluxfw/flux-config/archive/refs/tags/v2024-03-20-1.tar.gz

installArchiveLibrary flux-shutdown-handler https://github.com/fluxfw/flux-shutdown-handler/archive/refs/tags/v2024-03-20-1.tar.gz

installArchiveLibrary mime-db https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz

installArchiveLibrary uglify-js https://registry.npmjs.org/uglify-js/-/uglify-js-3.17.4.tgz
