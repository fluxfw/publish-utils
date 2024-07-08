#!/usr/bin/env node
import { BUILD_CONFIG_APPLICATION_ID } from "./application/Build/BUILD_CONFIG.mjs";
import { existsSync } from "node:fs";
import { ShutdownHandler } from "shutdown-handler/ShutdownHandler.mjs";
import { CONFIG_TYPE_BOOLEAN, CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { dirname, join, relative } from "node:path";
import { mkdir, rm, symlink, writeFile } from "node:fs/promises";

const shutdown_handler = await ShutdownHandler.new();

try {
    const config = await (await import("config/Config.mjs")).Config.new(
        await (await import("config/getValueProviders.mjs")).getValueProviders(
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

    const application_folder = join(import.meta.dirname, "application");

    const application_id = await config.getConfig(
        "application-id",
        CONFIG_TYPE_STRING,
        async () => `${BUILD_CONFIG_APPLICATION_ID}${dev ? "-dev" : ""}`
    );

    const build_folder = await config.getConfig(
        "folder",
        CONFIG_TYPE_STRING,
        async () => join(import.meta.dirname, "build")
    );
    const build_usr_folder = join(build_folder, "usr", "local");
    const build_bin_folder = join(build_usr_folder, "bin");
    const build_lib_folder = join(build_usr_folder, "lib", application_id);
    const build_temp_folder = join(build_folder, "temp");

    const bundler = await (await import("bundler/Bundler.mjs")).Bundler.new();
    const minifier = await (await import("bundler/Minifier.mjs")).Minifier.new();

    if (existsSync(build_folder)) {
        throw new Error("Already built!");
    }

    const build_config = {
        APPLICATION_ID: application_id
    };

    for (const [
        src,
        dest,
        resolve = null
    ] of [
        [
            join(application_folder, "create-github-release.mjs"),
            join(build_lib_folder, "create-github-release.mjs")
        ],
        [
            join(application_folder, "get-release-changelog.mjs"),
            join(build_lib_folder, "get-release-changelog.mjs")
        ],
        [
            join(application_folder, "get-release-description.mjs"),
            join(build_lib_folder, "get-release-description.mjs")
        ],
        [
            join(application_folder, "get-release-title.mjs"),
            join(build_lib_folder, "get-release-title.mjs")
        ],
        [
            join(application_folder, "revoke-github-release.mjs"),
            join(build_lib_folder, "revoke-github-release.mjs")
        ],
        [
            join(application_folder, "update-release-version.mjs"),
            join(build_lib_folder, "update-release-version.mjs")
        ],
        [
            join(application_folder, "upload-asset-to-github-release.mjs"),
            join(build_lib_folder, "upload-asset-to-github-release.mjs")
        ]
    ].map(([
        _src,
        _dest
    ]) => [
            _src,
            _dest,
            async (type, path, parent_path = null, default_resolve = null) => {
                if (parent_path === null || !path.startsWith(".") || !path.endsWith("/Build/BUILD_CONFIG.mjs")) {
                    return null;
                }

                const absolute_path = default_resolve !== null ? await default_resolve(
                    type,
                    path,
                    parent_path
                ) : join(dirname(parent_path), path);

                if ([
                    null,
                    false
                ].includes(absolute_path)) {
                    return false;
                }

                if (!join(application_folder, "Build", "BUILD_CONFIG.mjs").includes(absolute_path)) {
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
            async (type, path, parent_path = null, default_resolve = null) => resolve !== null ? resolve(
                type,
                path,
                parent_path,
                default_resolve
            ) : null,
            minify,
            async code => minifier.minifyESMJavaScript(
                code
            ),
            null,
            null,
            null,
            null,
            null,
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
                join(build_lib_folder, "revoke-github-release.mjs"),
                join(build_bin_folder, `${application_id}-revoke-github-release`)
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
