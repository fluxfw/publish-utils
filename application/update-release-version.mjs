#!/usr/bin/env node
import { Config } from "config/Config.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";
import { UpdateReleaseVersion } from "@publish-utils/publish/UpdateReleaseVersion.mjs";

await (await UpdateReleaseVersion.new())
    .updateReleaseVersion(
        await (await Config.new(
            await getValueProviders(
                true
            )
        )).getConfig(
            "path",
            CONFIG_TYPE_STRING
        )
    );
