#!/usr/bin/env node
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

    await (await import("../src/Adapter/Api/PublishUtilsApi.mjs")).PublishUtilsApi.new()
        .uploadAssetToGithubRelease(
            path,
            asset_path,
            process.argv[4] ?? null
        );
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
