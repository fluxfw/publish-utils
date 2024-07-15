#!/usr/bin/env node
import { Config } from "config/Config.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";
import { RevokeGithubRelease } from "@publish-utils/publish/RevokeGithubRelease.mjs";

await (await RevokeGithubRelease.new())
    .revokeGithubRelease(
        await (await Config.new(
            await getValueProviders(
                true
            )
        )).getConfig(
            "path",
            CONFIG_TYPE_STRING
        )
    );
