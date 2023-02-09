#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path/posix";
import { readFile } from "node:fs/promises";

let shutdown_handler = null;
try {
    shutdown_handler = await (await import("../../flux-shutdown-handler-api/src/Adapter/Api/ShutdownHandlerApi.mjs")).ShutdownHandlerApi.new()
        .getShutdownHandler();

    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path");
    }

    const metadata_json_file = join(path, "metadata.json");
    if (!existsSync(metadata_json_file)) {
        throw new Error(`Missing ${metadata_json_file}`);
    }

    const metadata = JSON.parse(await readFile(metadata_json_file, "utf8"));

    process.stdout.write(metadata.version);
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
