#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { basename, join } from "node:path/posix";

let shutdown_handler = null;
try {
    shutdown_handler = await (await import("../../flux-shutdown-handler-api/src/Adapter/Api/ShutdownHandlerApi.mjs")).ShutdownHandlerApi.new()
        .getShutdownHandler();

    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path");
    }

    const asset_path = process.argv[3] ?? null;
    if (asset_path === null) {
        throw new Error("Please pass an asset path");
    }

    const asset_name = process.argv[4] ?? basename(asset_path);

    const tag = execFileSync("get-release-tag", [
        path
    ], {
        encoding: "utf8"
    });

    console.log(`Upload asset ${asset_path} as ${asset_name} to github release ${tag}`);

    /*const release_id = JSON.parse(execFileSync("gh", [
        "api",
        "--method",
        METHOD_GET,
        "--hostname",
        "uploads.github.com",
        `/repos/{owner}/{repo}/releases/tags/${tag}`
    ], {
        cwd: path,
        encoding: "utf8"
    })).id;

    execFileSync("gh", [
        "api",
        "--method",
        METHOD_POST,
        `/repos/{owner}/{repo}/releases/${release_id}/assets`,
        "-f",
        `name=${asset_name}`,
        "--input",
        join(path, asset_path)
    ], {
        cwd: path
    });*/
    execFileSync("gh", [
        "release",
        "upload",
        tag,
        `${join(path, asset_path)}#${asset_name}`
    ], {
        cwd: path
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
