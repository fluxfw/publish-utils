#!/usr/bin/env node
import { Config } from "config/Config.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { GetReleaseTitle } from "@publish-utils/publish/Publish/GetReleaseTitle.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";

process.stdout.write(await (await GetReleaseTitle.new())
    .getReleaseTitle(
        await (await Config.new(
            await getValueProviders(
                true
            )
        )).getConfig(
            "path",
            CONFIG_TYPE_STRING
        )
    ));
