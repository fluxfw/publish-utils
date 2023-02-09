#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path/posix";
import { readFile } from "node:fs/promises";
import { METHOD_PATCH, METHOD_PUT } from "../../flux-http-api/src/Adapter/Method/METHOD.mjs";

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

    const description = metadata.description ?? "";

    const homepage = metadata.homepage ?? "";

    const topics = metadata.topics ?? [];

    console.log("Update github metadata");

    execFileSync("gh", [
        "api",
        "--method",
        METHOD_PATCH,
        "/repos/{owner}/{repo}",
        "--input",
        "-"
    ], {
        cwd: path,
        input: JSON.stringify({
            description,
            homepage
        })
    });

    execFileSync("gh", [
        "api",
        "--method",
        METHOD_PUT,
        "/repos/{owner}/{repo}/topics",
        "--input",
        "-"
    ], {
        cwd: path,
        input: JSON.stringify({
            names: topics
        })
    });
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
