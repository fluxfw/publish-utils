#!/usr/bin/env node
let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = await (await import("flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path");
    }

    process.stdout.write(await (await (await import("../src/GetReleaseChangelog.mjs")).GetReleaseChangelog.new())
        .getReleaseChangelog(
            path
        ));
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
