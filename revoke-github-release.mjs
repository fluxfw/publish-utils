#!/usr/bin/env node
import { CONFIG_TYPE_STRING } from "config/src/CONFIG_TYPE.mjs";
import { ShutdownHandler } from "shutdown-handler/src/ShutdownHandler.mjs";

const shutdown_handler = await ShutdownHandler.new();

try {
    await (await (await import("./src/RevokeGithubRelease.mjs")).RevokeGithubRelease.new())
        .revokeGithubRelease(
            await (await (await import("config/src/Config.mjs")).Config.new(
                await (await import("config/src/getValueProviders.mjs")).getValueProviders(
                    true
                )
            )).getConfig(
                "path",
                CONFIG_TYPE_STRING
            )
        );
} catch (error) {
    console.error(error);

    await shutdown_handler.shutdown(
        1
    );
}
