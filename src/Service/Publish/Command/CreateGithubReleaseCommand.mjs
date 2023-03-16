import { HttpClientRequest } from "../../../../../flux-http-api/src/Client/HttpClientRequest.mjs";
import { METHOD_POST } from "../../../../../flux-http-api/src/Method/METHOD.mjs";
import { HEADER_AUTHORIZATION, HEADER_USER_AGENT } from "../../../../../flux-http-api/src/Header/HEADER.mjs";

/** @typedef {import("../../../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class CreateGithubReleaseCommand {
    /**
     * @type {FluxHttpApi}
     */
    #flux_http_api;
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {FluxHttpApi} flux_http_api
     * @param {PublishService} publish_service
     * @returns {CreateGithubReleaseCommand}
     */
    static new(flux_http_api, publish_service) {
        return new this(
            flux_http_api,
            publish_service
        );
    }

    /**
     * @param {FluxHttpApi} flux_http_api
     * @param {PublishService} publish_service
     * @private
     */
    constructor(flux_http_api, publish_service) {
        this.#flux_http_api = flux_http_api;
        this.#publish_service = publish_service;
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async createGithubRelease(path) {
        const tag = await this.#publish_service.getReleaseTag(
            path
        );

        const title = await this.#publish_service.getReleaseTitle(
            path
        );

        console.log(`Create github release ${title} from ${tag}`);

        await this.#flux_http_api.request(
            HttpClientRequest.json(
                new URL(`https://api.github.com/repos/${await this.#publish_service.getGithubRepository(
                    path
                )}/releases`),
                {
                    tag_name: tag,
                    name: title,
                    body: await this.#publish_service.getReleaseDescription(
                        path
                    ),
                    prerelease: tag.includes("alpha") || tag.includes("beta") || tag.includes("pre") || tag.includes("rc")
                },
                METHOD_POST,
                {
                    [HEADER_AUTHORIZATION]: await this.#publish_service.getGithubAuthorization(),
                    [HEADER_USER_AGENT]: "flux-publish-utils"
                },
                true,
                false
            )
        );
    }
}
