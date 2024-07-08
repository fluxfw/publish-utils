#!/usr/bin/env node
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { ShutdownHandler } from "shutdown-handler/ShutdownHandler.mjs";

const shutdown_handler = await ShutdownHandler.new();

try {
    const config = await (await import("config/Config.mjs")).Config.new(
        await (await import("config/getValueProviders.mjs")).getValueProviders(
            true
        )
    );

    await (await (await import("./Publish/UploadAssetToGithubRelease.mjs")).UploadAssetToGithubRelease.new())
        .uploadAssetToGithubRelease(
            await config.getConfig(
                "path",
                CONFIG_TYPE_STRING
            ),
            await config.getConfig(
                "asset-path",
                CONFIG_TYPE_STRING
            ),
            await config.getConfig(
                "asset-name",
                CONFIG_TYPE_STRING,
                null,
                false
            )
        );
} catch (error) {
    console.error(error);

    await shutdown_handler.shutdown(
        1
    );
}
