import { HttpClientRequest } from "../../../../../flux-http-api/src/Client/HttpClientRequest.mjs";
import { HEADER_AUTHORIZATION, HEADER_USER_AGENT } from "../../../../../flux-http-api/src/Header/HEADER.mjs";
import { METHOD_PATCH, METHOD_PUT } from "../../../../../flux-http-api/src/Method/METHOD.mjs";

/** @typedef {import("../../../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class UpdateGithubMetadataCommand {
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
     * @returns {UpdateGithubMetadataCommand}
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
    async updateGithubMetadata(path) {
        const metadata = await this.#publish_service.getMetadata(
            path
        );

        console.log("Update github metadata");

        const repository = await this.#publish_service.getGithubRepository(
            path
        );

        const authorization = await this.#publish_service.getGithubAuthorization();

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
