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

    const tag = execFileSync("get-release-tag", [
        path
    ], {
        encoding: "utf8"
    });

    const changelog = execFileSync("get-release-changelog", [
        path
    ], {
        encoding: "utf8"
    });

    const title_header_end_position = changelog.indexOf("\n");
    let title = "";
    if (title_header_end_position !== -1) {
        title = changelog.substring(3 + tag.length, title_header_end_position);
    }

    title = title.trim();

    if (title === "") {
        title = tag;
    }

    process.stdout.write(title);
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
