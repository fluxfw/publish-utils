import { HttpClientRequest } from "../../../flux-http/src/Client/HttpClientRequest.mjs";
import { METHOD_POST } from "../../../flux-http/src/Method/METHOD.mjs";
import { HEADER_AUTHORIZATION, HEADER_USER_AGENT } from "../../../flux-http/src/Header/HEADER.mjs";

/** @typedef {import("../../../flux-http/src/FluxHttp.mjs").FluxHttp} FluxHttp */
/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class CreateGithubRelease {
    /**
     * @type {FluxHttp}
     */
    #flux_http;
    /**
     * @type {FluxPublishUtils}
     */
    #flux_publish_utils;

    /**
     * @param {FluxHttp} flux_http
     * @param {FluxPublishUtils} flux_publish_utils
     * @returns {CreateGithubRelease}
     */
    static new(flux_http, flux_publish_utils) {
        return new this(
            flux_http,
            flux_publish_utils
        );
    }

    /**
     * @param {FluxHttp} flux_http
     * @param {FluxPublishUtils} flux_publish_utils
     * @private
     */
    constructor(flux_http, flux_publish_utils) {
        this.#flux_http = flux_http;
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

        await this.#flux_http.request(
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
