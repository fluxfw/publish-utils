#!/usr/bin/env node
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ShutdownHandler } from "shutdown-handler/src/ShutdownHandler.mjs";
import { basename, dirname, join, relative } from "node:path";
import { mkdir, symlink } from "node:fs/promises";

const shutdown_handler = await ShutdownHandler.new();

try {
    const dev = (process.argv[2] ?? "prod") === "dev";

    const src_bin_folder = dirname(fileURLToPath(import.meta.url));
    const src_root_folder = join(src_bin_folder, "..");

    const build_folder = join(src_root_folder, "build");
    const build_usr_folder = join(build_folder, "usr", "local");
    const build_bin_folder = join(build_usr_folder, "bin");
    const build_lib_folder = join(build_usr_folder, "lib", basename(src_root_folder));

    if (existsSync(build_folder)) {
        throw new Error("Already built!");
    }

    const bundler = await (await import("build-utils/src/Bundler.mjs")).Bundler.new();
    const minifier = await (await import("build-utils/src/Minifier.mjs")).Minifier.new();
    for (const [
        src,
        dest
    ] of [
            [
                join(src_bin_folder, "create-github-release.mjs"),
                join(build_lib_folder, "create-github-release.mjs")
            ],
            [
                join(src_bin_folder, "get-release-changelog.mjs"),
                join(build_lib_folder, "get-release-changelog.mjs")
            ],
            [
                join(src_bin_folder, "get-release-description.mjs"),
                join(build_lib_folder, "get-release-description.mjs")
            ],
            [
                join(src_bin_folder, "get-release-title.mjs"),
                join(build_lib_folder, "get-release-title.mjs")
            ],
            [
                join(src_bin_folder, "update-release-version.mjs"),
                join(build_lib_folder, "update-release-version.mjs")
            ],
            [
                join(src_bin_folder, "upload-asset-to-github-release.mjs"),
                join(build_lib_folder, "upload-asset-to-github-release.mjs")
            ]
        ]) {
        await bundler.bundle(
            src,
            dest,
            null,
            async code => minifier.minifyCSS(
                code
            ),
            async code => minifier.minifyXML(
                code
            ),
            dev
        );
    }

    if (!dev) {
        await minifier.minifyFolder(
            build_folder
        );
    }

    for (const [
        src,
        dest
    ] of [
            [
                join(build_lib_folder, "create-github-release.mjs"),
                join(build_bin_folder, "create-github-release")
            ],
            [
                join(build_lib_folder, "get-release-changelog.mjs"),
                join(build_bin_folder, "get-release-changelog")
            ],
            [
                join(build_lib_folder, "get-release-description.mjs"),
                join(build_bin_folder, "get-release-description")
            ],
            [
                join(build_lib_folder, "get-release-title.mjs"),
                join(build_bin_folder, "get-release-title")
            ],
            [
                join(build_lib_folder, "update-release-version.mjs"),
                join(build_bin_folder, "update-release-version")
            ],
            [
                join(build_lib_folder, "upload-asset-to-github-release.mjs"),
                join(build_bin_folder, "upload-asset-to-github-release")
            ]
        ]) {
        console.log(`Create symlink ${src} to ${dest}`);

        const dest_folder = dirname(dest);

        await mkdir(dest_folder, {
            recursive: true
        });

        await symlink(relative(dest_folder, src), dest);
    }
} catch (error) {
    console.error(error);

    await shutdown_handler.shutdown(
        1
    );
}
