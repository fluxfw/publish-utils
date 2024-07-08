#!/usr/bin/env sh

set -e

node_modules_folder="`dirname "$0"`/node_modules"

installArchiveLibrary() {
    dest="$node_modules_folder/$1"

    if [ -e "$dest" ]; then
        echo "$1 is already installed in $dest!" >&2
        exit 1
    fi

    echo "Install archive library $2 to $dest"

    while true; do 
        rm -rf "$dest" && mkdir -p "$dest"

        wget -T 5 -O "$dest.tar.gz" "$2" && true

        if [ "$?" = 0 ] && [ -e "$dest.tar.gz" ]; then
            (cd "$dest" && tar -xzf "$dest.tar.gz" --strip-components=1)
            unlink "$dest.tar.gz"

            if [ `ls "$dest" | wc -l` != 0 ]; then
                break
            fi
        fi

        sleep 10
    done
}

installArchiveLibrary bundler https://github.com/fluxfw/bundler/archive/refs/tags/v2024-07-08-3.tar.gz

installArchiveLibrary config https://github.com/fluxfw/config/archive/refs/tags/v2024-07-08-1.tar.gz

installArchiveLibrary mime-db https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz

installArchiveLibrary shutdown-handler https://github.com/fluxfw/shutdown-handler/archive/refs/tags/v2024-07-08-1.tar.gz

installArchiveLibrary uglify-js https://registry.npmjs.org/uglify-js/-/uglify-js-3.17.4.tgz
