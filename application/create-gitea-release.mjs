#!/usr/bin/env node
import { Config } from "config/Config.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { CreateGiteaRelease } from "@publish-utils/publish/Publish/CreateGiteaRelease.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";

await (await CreateGiteaRelease.new())
    .createGiteaRelease(
        await (await Config.new(
            await getValueProviders(
                true
            )
        )).getConfig(
            "path",
            CONFIG_TYPE_STRING
        )
    );
