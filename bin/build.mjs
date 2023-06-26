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

    const flux_pwa_generator = (await import("../../flux-pwa-generator/src/FluxPwaGenerator.mjs")).FluxPwaGenerator.new();

    const bin_folder = dirname(fileURLToPath(import.meta.url));
    const root_folder = join(bin_folder, "..");
    const libs_folder = join(root_folder, "..");
    const libs_file_filter = root_file => root_file.startsWith("flux-") ? (root_file.includes("/bin/") || root_file.includes("/src/")) && !root_file.startsWith("flux-pwa-generator/") && !root_file.endsWith("/bin/build.mjs") && ![
        ".md",
        ".sh"
    ].includes(extname(root_file)) && !basename(root_file).includes("-template") : true;

    if (mode === "prod") {
        await flux_pwa_generator.deleteExcludedFiles(
            libs_folder,
            libs_file_filter
        );

        await flux_pwa_generator.deleteEmptyFolders(
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
