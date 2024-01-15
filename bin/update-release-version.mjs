#!/usr/bin/env node
let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = (await import("flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path");
    }

    await (await import("../src/UpdateReleaseVersion.mjs")).UpdateReleaseVersion.new()
        .updateReleaseVersion(
            path
        );
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
