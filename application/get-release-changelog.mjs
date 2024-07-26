#!/usr/bin/env node
import { Config } from "config/Config.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { GetReleaseChangelog } from "@publish-utils/publish/Publish/GetReleaseChangelog.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";

process.stdout.write(await (await GetReleaseChangelog.new())
    .getReleaseChangelog(
        await (await Config.new(
            await getValueProviders(
                true
            )
        )).getConfig(
            "path",
            CONFIG_TYPE_STRING
        )
    ));
