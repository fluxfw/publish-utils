#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path/posix";

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

    if (!dev_mode) {
        const {
            Bundler
        } = await import("../../flux-pwa-generator/src/Bundler.mjs");
        const {
            DeleteEmptyFoldersOrInvalidSymlinks
        } = await import("../../flux-pwa-generator/src/DeleteEmptyFoldersOrInvalidSymlinks.mjs");
        const {
            DeleteExcludedFiles
        } = await import("../../flux-pwa-generator/src/DeleteExcludedFiles.mjs");
        const {
            Minifier
        } = await import("../../flux-pwa-generator/src/Minifier.mjs");

        const bin_names = [
            "create-github-release",
            "get-release-changelog",
            "get-release-description",
            "get-release-title",
            "update-release-version",
            "upload-asset-to-github-release"
        ];

        const bundler = Bundler.new();
        for (const bin_name of bin_names) {
            const bin_path = join(bin_folder, `${bin_name}.mjs`);

            await bundler.bundle(
                bin_path,
                bin_path,
                null,
                null,
                dev_mode
            );
        }

        await DeleteExcludedFiles.new()
            .deleteExcludedFiles(
                libs_folder,
                root_file => bin_names.some(bin_name => root_file === `flux-publish-utils/bin/${bin_name}.mjs`)
            );

        await DeleteEmptyFoldersOrInvalidSymlinks.new()
            .deleteEmptyFoldersOrInvalidSymlinks(
                libs_folder
            );

        await Minifier.new()
            .minifFolder(
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
