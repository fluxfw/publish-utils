import { HttpClientRequest } from "../../../flux-http-api/src/Client/HttpClientRequest.mjs";
import { METHOD_POST } from "../../../flux-http-api/src/Method/METHOD.mjs";
import { HEADER_AUTHORIZATION, HEADER_USER_AGENT } from "../../../flux-http-api/src/Header/HEADER.mjs";

/** @typedef {import("../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class CreateGithubRelease {
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
     * @returns {CreateGithubRelease}
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
    async createGithubRelease(path) {
        const tag = await this.#flux_publish_utils.getReleaseTag(
            path
        );

        const title = await this.#flux_publish_utils.getReleaseTitle(
            path
        );

        console.log(`Create github release ${title} from tag ${tag}`);

        await this.#flux_http_api.request(
            HttpClientRequest.json(
                new URL(`https://api.github.com/repos/${await this.#flux_publish_utils.getGithubRepository(
                    path
                )}/releases`),
                {
                    tag_name: tag,
                    name: title,
                    body: await this.#flux_publish_utils.getReleaseDescription(
                        path
                    ),
                    prerelease: tag.includes("alpha") || tag.includes("beta") || tag.includes("pre") || tag.includes("rc")
                },
                METHOD_POST,
                {
                    [HEADER_AUTHORIZATION]: await this.#flux_publish_utils.getGithubAuthorization(),
                    [HEADER_USER_AGENT]: "flux-publish-utils"
                },
                true,
                false
            )
        );
    }
}
