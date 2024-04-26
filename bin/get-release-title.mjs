#!/usr/bin/env node
import { FluxShutdownHandler } from "flux-shutdown-handler/src/FluxShutdownHandler.mjs";

const flux_shutdown_handler = await FluxShutdownHandler.new();

try {
    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path!");
    }

    process.stdout.write(await (await (await import("../src/GetReleaseTitle.mjs")).GetReleaseTitle.new())
        .getReleaseTitle(
            path
        ));
} catch (error) {
    console.error(error);

    await flux_shutdown_handler.shutdown(
        1
    );
}
