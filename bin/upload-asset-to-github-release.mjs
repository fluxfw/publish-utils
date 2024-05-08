#!/usr/bin/env node
import { ShutdownHandler } from "shutdown-handler/src/ShutdownHandler.mjs";

const shutdown_handler = await ShutdownHandler.new();

try {
    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path!");
    }

    const asset_path = process.argv[3] ?? null;
    if (asset_path === null) {
        throw new Error("Please pass an asset path!");
    }

    await (await (await import("../src/UploadAssetToGithubRelease.mjs")).UploadAssetToGithubRelease.new())
        .uploadAssetToGithubRelease(
            path,
            asset_path,
            process.argv[4] ?? null
        );
} catch (error) {
    console.error(error);

    await shutdown_handler.shutdown(
        1
    );
}
