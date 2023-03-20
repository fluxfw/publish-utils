import { HttpClientRequest } from "../../../flux-http-api/src/Client/HttpClientRequest.mjs";
import { HEADER_AUTHORIZATION, HEADER_USER_AGENT } from "../../../flux-http-api/src/Header/HEADER.mjs";
import { METHOD_PATCH, METHOD_PUT } from "../../../flux-http-api/src/Method/METHOD.mjs";

/** @typedef {import("../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class UpdateGithubMetadata {
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
     * @returns {UpdateGithubMetadata}
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
     * @returns {Promise<void>}
     */
    async updateGithubMetadata(path) {
        const metadata = await this.#flux_publish_utils.getMetadata(
            path
        );

        console.log("Update github metadata");

        const repository = await this.#flux_publish_utils.getGithubRepository(
            path
        );

        const authorization = await this.#flux_publish_utils.getGithubAuthorization();

        await this.#flux_http_api.request(
            HttpClientRequest.json(
                new URL(`https://api.github.com/repos/${repository}`),
                {
                    description: metadata.description ?? "",
                    homepage: metadata.homepage ?? ""
                },
                METHOD_PATCH,
                {
                    [HEADER_AUTHORIZATION]: authorization,
                    [HEADER_USER_AGENT]: "flux-publish-utils"
                },
                true,
                false
            )
        );

        await this.#flux_http_api.request(
            HttpClientRequest.json(
                new URL(`https://api.github.com/repos/${repository}/topics`),
                {
                    names: metadata.topics ?? []
                },
                METHOD_PUT,
                {
                    [HEADER_AUTHORIZATION]: authorization,
                    [HEADER_USER_AGENT]: "flux-publish-utils"
                },
                true,
                false
            )
        );
    }
}
