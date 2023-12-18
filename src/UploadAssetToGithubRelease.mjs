import { blob } from "node:stream/consumers";
import { createReadStream } from "node:fs";
import { GetGithubAuthorization } from "./GetGithubAuthorization.mjs";
import { GetGithubRepository } from "./GetGithubRepository.mjs";
import { GetReleaseTag } from "./GetReleaseTag.mjs";
import MIME_DB from "mime-db";
import { stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";

export class UploadAssetToGithubRelease {
    /**
     * @returns {UploadAssetToGithubRelease}
     */
    static new() {
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
    async uploadAssetToGithubRelease(path, asset_path, asset_name = null) {
        const _asset_name = asset_name ?? basename(asset_path);

        const _asset_path = join(path, asset_path);

        const tag = await GetReleaseTag.new()
            .getReleaseTag(
                path
            );

        console.log(`Upload asset ${asset_path} as ${_asset_name} to github release ${tag}`);

        const repository = await GetGithubRepository.new()
            .getGithubRepository(
                path
            );

        const authorization = await GetGithubAuthorization.new()
            .getGithubAuthorization();

        const response = await fetch(`https://api.github.com/repos/${repository}/releases/tags/${tag}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: authorization,
                "User-Agent": "flux-publish-utils"
            }
        });

        if (!response.ok || !(response.headers.get("Content-Type")?.includes("application/json") ?? false)) {
            throw response;
        }

        const url = new URL(`https://uploads.github.com/repos/${repository}/releases/${(await response.json()).id}/assets`);
        url.searchParams.set("name", _asset_name);

        const _response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                Authorization: authorization,
                "Content-Length": (await stat(_asset_path)).size,
                "Content-Type": this.#getMimeType(
                    _asset_path
                ),
                "User-Agent": "flux-publish-utils"
            },
            body: await blob(createReadStream(_asset_path))
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
