#!/usr/bin/env node
import { ShutdownHandler } from "shutdown-handler/src/ShutdownHandler.mjs";

const shutdown_handler = await ShutdownHandler.new();

try {
    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path!");
    }

    await (await (await import("../src/UpdateReleaseVersion.mjs")).UpdateReleaseVersion.new())
        .updateReleaseVersion(
            path
        );
} catch (error) {
    console.error(error);

    await shutdown_handler.shutdown(
        1
    );
}
