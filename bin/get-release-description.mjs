#!/usr/bin/env node
import { execFileSync } from "node:child_process";

let shutdown_handler = null;
try {
    shutdown_handler = await (await import("../../flux-shutdown-handler-api/src/Adapter/Api/ShutdownHandlerApi.mjs")).ShutdownHandlerApi.new()
        .getShutdownHandler();

    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path");
    }

    const changelog = execFileSync("get-release-changelog", [
        path
    ], {
        encoding: "utf8"
    });

    const description_header_end_position = changelog.indexOf("\n");
    let description = "";
    if (description_header_end_position !== -1) {
        description = changelog.substring(description_header_end_position + 1);
    }

    description = description.trim();

    process.stdout.write(description);
} catch (error) {
    console.error(error);

    if (shutdown_handler !== null) {
        await shutdown_handler.shutdown(
            1
        );
    } else {
        process.exit(1);
    }
}
