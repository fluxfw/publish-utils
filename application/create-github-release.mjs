#!/usr/bin/env node
import { Config } from "config/Config.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { CreateGithubRelease } from "@publish-utils/publish/CreateGithubRelease.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";

await (await CreateGithubRelease.new())
    .createGithubRelease(
        await (await Config.new(
            await getValueProviders(
                true
            )
        )).getConfig(
            "path",
            CONFIG_TYPE_STRING
        )
    );
