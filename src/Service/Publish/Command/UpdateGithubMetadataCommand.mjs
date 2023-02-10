import { HttpClientRequest } from "../../../../../flux-http-api/src/Adapter/Client/HttpClientRequest.mjs";
import { HEADER_ACCEPT, HEADER_AUTHORIZATION, HEADER_USER_AGENT } from "../../../../../flux-http-api/src/Adapter/Header/HEADER.mjs";
import { METHOD_PATCH, METHOD_PUT } from "../../../../../flux-http-api/src/Adapter/Method/METHOD.mjs";

/** @typedef {import("../../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class UpdateGithubMetadataCommand {
    /**
     * @type {HttpApi}
     */
    #http_api;
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {HttpApi} http_api
     * @param {PublishService} publish_service
     * @returns {UpdateGithubMetadataCommand}
     */
    static new(http_api, publish_service) {
        return new this(
            http_api,
            publish_service
        );
    }

    /**
     * @param {HttpApi} http_api
     * @param {PublishService} publish_service
     * @private
     */
    constructor(http_api, publish_service) {
        this.#http_api = http_api;
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

        await (await this.#http_api.request(
            HttpClientRequest.json(
                new URL(`https://api.github.com/repos/${repository}`),
                {
                    description: metadata.description ?? "",
                    homepage: metadata.homepage ?? ""
                },
                METHOD_PATCH,
                {
                    [HEADER_ACCEPT]: "application/vnd.github+json",
                    [HEADER_AUTHORIZATION]: authorization,
                    [HEADER_USER_AGENT]: "flux-publish-utils"
                }
            )
        )).body.json();

        await (await this.#http_api.request(
            HttpClientRequest.json(
                new URL(`https://api.github.com/repos/${repository}/topics`),
                {
                    names: metadata.topics ?? []
                },
                METHOD_PUT,
                {
                    [HEADER_ACCEPT]: "application/vnd.github+json",
                    [HEADER_AUTHORIZATION]: authorization,
                    [HEADER_USER_AGENT]: "flux-publish-utils"
                }
            )
        )).body.json();
    }
}
