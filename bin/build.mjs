#!/usr/bin/env node
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { basename, dirname, join, relative } from "node:path";
import { mkdir, symlink } from "node:fs/promises";

let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = await (await import("flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const dev_mode = (process.argv[2] ?? "prod") === "dev";

    const bin_folder = dirname(fileURLToPath(import.meta.url));

    const root_folder = join(bin_folder, "..");

    const build_folder = join(root_folder, "build");

    const build_root_folder = join(build_folder, "opt", basename(root_folder));

    const build_usr_local_bin_folder = join(build_folder, "usr", "local", "bin");

    const bundler = await (await import("flux-build-utils/src/Bundler.mjs")).Bundler.new();
    const minifier = await (await import("flux-build-utils/src/Minifier.mjs")).Minifier.new();

    if (existsSync(build_folder)) {
        throw new Error("Already built!");
    }

    for (const folder of [
        build_root_folder,
        build_usr_local_bin_folder
    ]) {
        console.log(`Create folder ${folder}`);

        await mkdir(folder, {
            recursive: true
        });
    }

    for (const [
        src,
        dest
    ] of [
            [
                join(bin_folder, "create-github-release.mjs"),
                join(build_root_folder, "create-github-release.mjs")
            ],
            [
                join(bin_folder, "get-release-changelog.mjs"),
                join(build_root_folder, "get-release-changelog.mjs")
            ],
            [
                join(bin_folder, "get-release-description.mjs"),
                join(build_root_folder, "get-release-description.mjs")
            ],
            [
                join(bin_folder, "get-release-title.mjs"),
                join(build_root_folder, "get-release-title.mjs")
            ],
            [
                join(bin_folder, "update-release-version.mjs"),
                join(build_root_folder, "update-release-version.mjs")
            ],
            [
                join(bin_folder, "upload-asset-to-github-release.mjs"),
                join(build_root_folder, "upload-asset-to-github-release.mjs")
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
            dev_mode
        );
    }

    if (!dev_mode) {
        await minifier.minifyFolder(
            build_folder
        );
    }

    for (const [
        src,
        dest
    ] of [
            [
                join(build_root_folder, "create-github-release.mjs"),
                join(build_usr_local_bin_folder, "create-github-release")
            ],
            [
                join(build_root_folder, "get-release-changelog.mjs"),
                join(build_usr_local_bin_folder, "get-release-changelog")
            ],
            [
                join(build_root_folder, "get-release-description.mjs"),
                join(build_usr_local_bin_folder, "get-release-description")
            ],
            [
                join(build_root_folder, "get-release-title.mjs"),
                join(build_usr_local_bin_folder, "get-release-title")
            ],
            [
                join(build_root_folder, "update-release-version.mjs"),
                join(build_usr_local_bin_folder, "update-release-version")
            ],
            [
                join(build_root_folder, "upload-asset-to-github-release.mjs"),
                join(build_usr_local_bin_folder, "upload-asset-to-github-release")
            ]
        ]) {
        console.log(`Create symlink ${src} to ${dest}`);

        await symlink(relative(dirname(dest), src), dest);
    }
} catch (error) {
    console.error(error);

    if (flux_shutdown_handler !== null) {
        await flux_shutdown_handler.shutdown(
            1
        );
    } else {
        process.exit(1);
    }
}
