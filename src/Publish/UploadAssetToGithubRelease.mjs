import { createReadStream } from "node:fs";
import { HttpClientRequest } from "../../../flux-http-api/src/Client/HttpClientRequest.mjs";
import { METHOD_POST } from "../../../flux-http-api/src/Method/METHOD.mjs";
import { stat } from "node:fs/promises";
import { basename, join } from "node:path/posix";
import { HEADER_ACCEPT, HEADER_AUTHORIZATION, HEADER_CONTENT_LENGTH, HEADER_CONTENT_TYPE, HEADER_USER_AGENT } from "../../../flux-http-api/src/Header/HEADER.mjs";

/** @typedef {import("../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class UploadAssetToGithubRelease {
    /**
     * @type {FluxHttpApi}
     */
    #flux_http_api;
    /**
     * @type {FluxPublishUtils}
     */
    #flux_publish_utils;

    /**
     * @param {FluxHttpApi} flux_http_api
     * @param {FluxPublishUtils} flux_publish_utils
     * @returns {UploadAssetToGithubRelease}
     */
    static new(flux_http_api, flux_publish_utils) {
        return new this(
            flux_http_api,
            flux_publish_utils
        );
    }

    /**
     * @param {FluxHttpApi} flux_http_api
     * @param {FluxPublishUtils} flux_publish_utils
     * @private
     */
    constructor(flux_http_api, flux_publish_utils) {
        this.#flux_http_api = flux_http_api;
        this.#flux_publish_utils = flux_publish_utils;
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

        const tag = await this.#flux_publish_utils.getReleaseTag(
            path
        );

        console.log(`Upload asset ${asset_path} as ${_asset_name} to github release ${tag}`);

        const repository = await this.#flux_publish_utils.getGithubRepository(
            path
        );

        const authorization = await this.#flux_publish_utils.getGithubAuthorization();

        const url = new URL(`https://uploads.github.com/repos/${repository}/releases/${(await (await this.#flux_http_api.request(
            HttpClientRequest.new(
                new URL(`https://api.github.com/repos/${repository}/releases/tags/${tag}`),
                null,
                null,
                {
                    [HEADER_ACCEPT]: "application/vnd.github+json",
                    [HEADER_AUTHORIZATION]: authorization,
                    [HEADER_USER_AGENT]: "flux-publish-utils"
                },
                true
            )
        )).body.json()).id}/assets`);
        url.searchParams.set("name", _asset_name);
        await this.#flux_http_api.request(
            await HttpClientRequest.nodeStream(
                url,
                createReadStream(_asset_path),
                METHOD_POST,
                {
                    [HEADER_AUTHORIZATION]: authorization,
                    [HEADER_CONTENT_LENGTH]: (await stat(_asset_path)).size,
                    [HEADER_CONTENT_TYPE]: await this.#flux_http_api.getMimeTypeByPath(
                        _asset_path
                    ),
                    [HEADER_USER_AGENT]: "flux-publish-utils"
                },
                true,
                false
            )
        );
    }
}
