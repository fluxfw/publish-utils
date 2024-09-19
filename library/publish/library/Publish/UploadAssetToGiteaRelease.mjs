import { blob } from "node:stream/consumers";
import { createReadStream } from "node:fs";
import { GetGiteaConfig } from "../Gitea/GetGiteaConfig.mjs";
import { GetReleaseTag } from "./GetReleaseTag.mjs";
import MIME_DB from "mime-db/db.json" with { type: "json" };
import { stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";

export class UploadAssetToGiteaRelease {
    /**
     * @returns {Promise<UploadAssetToGiteaRelease>}
     */
    static async new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} path
     * @param {string} asset_path
     * @param {string | null} asset_name
     * @returns {Promise<void>}
     */
    async uploadAssetToGiteaRelease(path, asset_path, asset_name = null) {
        const _asset_name = asset_name ?? basename(asset_path);

        const _asset_path = join(path, asset_path);

        const tag = await (await GetReleaseTag.new())
            .getReleaseTag(
                path
            );

        console.log(`Upload asset ${asset_path} as ${_asset_name} to gitea release ${tag}`);

        const gitea_config = await (await GetGiteaConfig.new())
            .getGiteaConfig(
                path
            );

        const response = await fetch(`${gitea_config.host}/api/v1/repos/${gitea_config.repository}/releases/tags/${tag}`, {
            headers: {
                Authorization: gitea_config.authorization
            },
            ...gitea_config["https-certificate-options"]
        });

        if (!response.ok || !(response.headers.get("Content-Type")?.includes("application/json") ?? false)) {
            throw response;
        }

        const url = new URL(`${gitea_config.host}/api/v1/repos/${gitea_config.repository}/releases/${(await response.json()).id}/assets`);
        url.searchParams.set("name", _asset_name);

        const _response = await fetch(`${url}`, {
            body: await blob(createReadStream(_asset_path)),
            headers: {
                Authorization: gitea_config.authorization,
                "Content-Length": (await stat(_asset_path)).size,
                "Content-Type": this.#getMimeType(
                    _asset_path
                )
            },
            method: "POST",
            ...gitea_config["https-certificate-options"]
        });

        if (!_response.ok) {
            throw _response;
        }

        await _response.body?.cancel();
    }

    /**
     * @param {string} path
     * @returns {string}
     */
    #getMimeType(path) {
        const ext = extname(path).substring(1).toLowerCase();

        return Object.entries(MIME_DB).find(([
            ,
            value
        ]) => value?.extensions?.includes(ext) ?? false)?.[0] ?? "";
    }
}
