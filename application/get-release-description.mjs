#!/usr/bin/env node
import { Config } from "config/Config.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { GetReleaseDescription } from "@publish-utils/publish/Publish/GetReleaseDescription.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";

process.stdout.write(await (await GetReleaseDescription.new())
    .getReleaseDescription(
        await (await Config.new(
            await getValueProviders(
                true
            )
        )).getConfig(
            "path",
            CONFIG_TYPE_STRING
        )
    ));
