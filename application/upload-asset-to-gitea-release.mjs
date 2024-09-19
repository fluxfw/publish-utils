#!/usr/bin/env node
import { Config } from "config/Config.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";
import { UploadAssetToGiteaRelease } from "@publish-utils/publish/Publish/UploadAssetToGiteaRelease.mjs";

const config = await Config.new(
    await getValueProviders(
        true
    )
);

await (await UploadAssetToGiteaRelease.new())
    .uploadAssetToGiteaRelease(
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
