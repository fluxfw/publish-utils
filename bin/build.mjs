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
    ].includes(extname(root_file).substring(1).toLowerCase()) && !basename(root_file).toLowerCase().includes("template");
    const delete_exclude_file_filter = root_file => root_file.startsWith("flux-") ? (root_file.includes("/bin/") || root_file.includes("/src/")) && !root_file.startsWith("flux-pwa-generator/") && !root_file.endsWith("/bin/build.mjs") && general_file_filter(
        root_file
    ) : true;

    if (!dev_mode) {
        const flux_pwa_generator = (await import("../../flux-pwa-generator/src/FluxPwaGenerator.mjs")).FluxPwaGenerator.new();

        await flux_pwa_generator.deleteExcludedFiles(
            libs_folder,
            delete_exclude_file_filter
        );

        await flux_pwa_generator.deleteEmptyFoldersOrInvalidSymlinks(
            libs_folder
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
