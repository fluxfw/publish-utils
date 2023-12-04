#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { basename, dirname, extname, join } from "node:path/posix";

let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = (await import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const mode = process.argv[2] ?? null;
    if (![
        "prod",
        "dev"
    ].includes(mode)) {
        throw new Error("Please pass prod or dev");
    }
    const dev_mode = mode === "dev";

    const bin_folder = dirname(fileURLToPath(import.meta.url));
    const root_folder = join(bin_folder, "..");
    const libs_folder = join(root_folder, "..");

    const general_file_filter = root_file => ![
        "md",
        "sh"
    ].includes(extname(root_file).substring(1).toLowerCase()) && (!root_file.startsWith("node_modules/") ? !basename(root_file).toLowerCase().includes("template") : true);

    if (!dev_mode) {
        const bins = [
            "create-github-release",
            "get-release-changelog",
            "get-release-description",
            "get-release-title",
            "update-release-version",
            "upload-asset-to-github-release"
        ];

        const bundler = (await import("../../flux-pwa-generator/src/Bundler.mjs")).Bundler.new();
        for (const bin of bins) {
            await bundler.bundle(
                join(bin_folder, `${bin}.mjs`),
                join(bin_folder, `${bin}.mjs`),
                null,
                null,
                dev_mode
            );
        }

        const {
            DeleteEmptyFoldersOrInvalidSymlinks
        } = await import("../../flux-pwa-generator/src/DeleteEmptyFoldersOrInvalidSymlinks.mjs");
        const {
            Minifier
        } = await import("../../flux-pwa-generator/src/Minifier.mjs");

        await (await import("../../flux-pwa-generator/src/DeleteExcludedFiles.mjs")).DeleteExcludedFiles.new()
            .deleteExcludedFiles(
                libs_folder,
                root_file => bins.some(bin => root_file === `flux-publish-utils/bin/${bin}.mjs`) || ([
                    "node_modules/mime-db/"
                ].some(_root_file => root_file.startsWith(_root_file)) && general_file_filter(
                    root_file
                ))
            );

        await DeleteEmptyFoldersOrInvalidSymlinks.new()
            .deleteEmptyFoldersOrInvalidSymlinks(
                libs_folder
            );

        await Minifier.new()
            .minifyFolder(
                root_folder
            );
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
