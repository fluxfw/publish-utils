#!/usr/bin/env node
import { BUILD_CONFIG_APPLICATION_ID } from "./src/Build/BUILD_CONFIG.mjs";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ShutdownHandler } from "shutdown-handler/src/ShutdownHandler.mjs";
import { CONFIG_TYPE_BOOLEAN, CONFIG_TYPE_STRING } from "config/src/CONFIG_TYPE.mjs";
import { dirname, join, relative } from "node:path";
import { mkdir, rm, symlink, writeFile } from "node:fs/promises";

const shutdown_handler = await ShutdownHandler.new();

try {
    const config = await (await import("config/src/Config.mjs")).Config.new(
        await (await import("config/src/getValueProviders.mjs")).getValueProviders(
            true
        )
    );

    const dev = await config.getConfig(
        "dev",
        CONFIG_TYPE_BOOLEAN,
        false
    );
    const minify = await config.getConfig(
        "minify",
        CONFIG_TYPE_BOOLEAN,
        !dev
    );

    const src_root_folder = dirname(fileURLToPath(import.meta.url));
    const src_folder = join(src_root_folder, "src");

    const application_id = await config.getConfig(
        "application-id",
        CONFIG_TYPE_STRING,
        async () => `${BUILD_CONFIG_APPLICATION_ID}${dev ? "-dev" : ""}`
    );

    const build_folder = await config.getConfig(
        "folder",
        CONFIG_TYPE_STRING,
        async () => join(src_root_folder, "build")
    );
    const build_usr_folder = join(build_folder, "usr", "local");
    const build_bin_folder = join(build_usr_folder, "bin");
    const build_lib_folder = join(build_usr_folder, "lib", application_id);
    const build_temp_folder = join(build_folder, "temp");

    if (existsSync(build_folder)) {
        throw new Error("Already built!");
    }

    const build_config = {
        APPLICATION_ID: application_id
    };

    const bundler = await (await import("build-utils/src/Bundler.mjs")).Bundler.new();
    const minifier = await (await import("build-utils/src/Minifier.mjs")).Minifier.new();
    for (const [
        src,
        dest,
        resolve = null
    ] of [
        [
            join(src_root_folder, "create-github-release.mjs"),
            join(build_lib_folder, "create-github-release.mjs")
        ],
        [
            join(src_root_folder, "get-release-changelog.mjs"),
            join(build_lib_folder, "get-release-changelog.mjs")
        ],
        [
            join(src_root_folder, "get-release-description.mjs"),
            join(build_lib_folder, "get-release-description.mjs")
        ],
        [
            join(src_root_folder, "get-release-title.mjs"),
            join(build_lib_folder, "get-release-title.mjs")
        ],
        [
            join(src_root_folder, "update-release-version.mjs"),
            join(build_lib_folder, "update-release-version.mjs")
        ],
        [
            join(src_root_folder, "upload-asset-to-github-release.mjs"),
            join(build_lib_folder, "upload-asset-to-github-release.mjs")
        ]
    ].map(([
        _src,
        _dest
    ]) => [
            _src,
            _dest,
            async (path, parent_path = null, default_resolve = null) => {
                if (parent_path === null || !path.startsWith(".") || !path.endsWith("/Build/BUILD_CONFIG.mjs")) {
                    return null;
                }

                const absolute_path = default_resolve !== null ? await default_resolve(
                    path,
                    parent_path
                ) : join(dirname(parent_path), path);

                if ([
                    null,
                    false
                ].includes(absolute_path)) {
                    return false;
                }

                if (!join(src_folder, "Build", "BUILD_CONFIG.mjs").includes(absolute_path)) {
                    return null;
                }

                const build_file = join(build_temp_folder, "BUILD_CONFIG.mjs");

                if (existsSync(build_file)) {
                    return build_file;
                }

                const build_data = `${Object.entries(build_config).map(([
                    key,
                    value
                ]) => `export const BUILD_CONFIG_${key} = ${value !== null && typeof value === "object" ? "Object.freeze(" : ""}${JSON.stringify(value)}${value !== null && typeof value === "object" ? ")" : ""};`).join("\n")}\n`;

                console.log(`Generate ${build_file} ${build_data.replaceAll("\n", "\\n")}`);

                await mkdir(build_temp_folder, {
                    recursive: true
                });

                await writeFile(build_file, build_data);

                return build_file;
            }
        ])) {
        await bundler.bundle(
            src,
            dest,
            async (path, parent_path = null, default_resolve = null) => resolve !== null ? resolve(
                path,
                parent_path,
                default_resolve
            ) : null,
            minify ? async code => minifier.minifyCSS(
                code
            ) : null,
            minify ? async code => minifier.minifyCSSRule(
                code
            ) : null,
            minify ? async code => minifier.minifyCSSSelector(
                code
            ) : null,
            minify ? async code => minifier.minifyXML(
                code
            ) : null,
            dev
        );
    }

    for (const src of [
        build_temp_folder
    ]) {
        if (!existsSync(src)) {
            continue;
        }

        console.log(`Delete ${src}`);

        await rm(src, {
            recursive: true
        });
    }

    if (minify) {
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
                join(build_bin_folder, `${application_id}-create-github-release`)
            ],
            [
                join(build_lib_folder, "get-release-changelog.mjs"),
                join(build_bin_folder, `${application_id}-get-release-changelog`)
            ],
            [
                join(build_lib_folder, "get-release-description.mjs"),
                join(build_bin_folder, `${application_id}-get-release-description`)
            ],
            [
                join(build_lib_folder, "get-release-title.mjs"),
                join(build_bin_folder, `${application_id}-get-release-title`)
            ],
            [
                join(build_lib_folder, "update-release-version.mjs"),
                join(build_bin_folder, `${application_id}-update-release-version`)
            ],
            [
                join(build_lib_folder, "upload-asset-to-github-release.mjs"),
                join(build_bin_folder, `${application_id}-upload-asset-to-github-release`)
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
