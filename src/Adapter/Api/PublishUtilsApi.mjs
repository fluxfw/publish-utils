import { CONFIG_ENV_PREFIX } from "../Config/CONFIG.mjs";
import { GITHUB_CONFIG_TOKEN_KEY } from "../Github/GITHUB_CONFIG.mjs";

/** @typedef {import("../../../../flux-config-api/src/Adapter/Api/ConfigApi.mjs").ConfigApi} ConfigApi */
/** @typedef {import("../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../../Service/Publish/Port/PublishService.mjs").PublishService} PublishService */
/** @typedef {import("../../../../flux-shutdown-handler-api/src/Adapter/ShutdownHandler/ShutdownHandler.mjs").ShutdownHandler} ShutdownHandler */

export class PublishUtilsApi {
    /**
     * @type {ConfigApi | null}
     */
    #config_api = null;
    /**
     * @type {HttpApi | null}
     */
    #http_api = null;
    /**
     * @type {PublishService | null}
     */
    #publish_service = null;
    /**
     * @type {ShutdownHandler}
     */
    #shutdown_handler;

    /**
     * @param {ShutdownHandler} shutdown_handler
     * @returns {PublishUtilsApi}
     */
    static new(shutdown_handler) {
        return new this(
            shutdown_handler
        );
    }

    /**
     * @param {ShutdownHandler} shutdown_handler
     * @private
     */
    constructor(shutdown_handler) {
        this.#shutdown_handler = shutdown_handler;
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async createGithubRelease(path) {
        await (await this.#getPublishService()).createGithubRelease(
            path
        );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseChangelog(path) {
        return (await this.#getPublishService()).getReleaseChangelog(
            path
        );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseDescription(path) {
        return (await this.#getPublishService()).getReleaseDescription(
            path
        );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseTag(path) {
        return (await this.#getPublishService()).getReleaseTag(
            path
        );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseTitle(path) {
        return (await this.#getPublishService()).getReleaseTitle(
            path
        );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseVersion(path) {
        return (await this.#getPublishService()).getReleaseVersion(
            path
        );
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async updateGithubMetadata(path) {
        await (await this.#getPublishService()).updateGithubMetadata(
            path
        );
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async updateReleaseVersion(path) {
        await (await this.#getPublishService()).updateReleaseVersion(
            path
        );
    }

    /**
     * @param {string} path
     * @param {string} asset_path
     * @param {string | null} asset_name
     * @returns {Promise<void>}
     */
    async uploadAssetToGithubRelease(path, asset_path, asset_name = null) {
        await (await this.#getPublishService()).uploadAssetToGithubRelease(
            path,
            asset_path,
            asset_name
        );
    }

    /**
     * @returns {Promise<ConfigApi>}
     */
    async #getConfigApi() {
        if (this.#config_api === null) {
            const { CliParamValueProviderImplementation } = await import("../../../../flux-config-api/src/Adapter/ValueProviderImplementation/CliParamValueProviderImplementation.mjs");

            this.#config_api ??= (await import("../../../../flux-config-api/src/Adapter/Api/ConfigApi.mjs")).ConfigApi.new(
                (await (await import("../../../../flux-config-api/src/Adapter/ValueProviderImplementation/getValueProviderImplementations.mjs")).getValueProviderImplementations(
                    CONFIG_ENV_PREFIX
                )).filter(value_provider_implementation => !(value_provider_implementation instanceof CliParamValueProviderImplementation))
            );
        }

        return this.#config_api;
    }

    /**
     * @returns {Promise<HttpApi>}
     */
    async #getHttpApi() {
        this.#http_api ??= (await import("../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs")).HttpApi.new(
            this.#shutdown_handler
        );

        return this.#http_api;
    }

    /**
     * @returns {Promise<PublishService>}
     */
    async #getPublishService() {
        this.#publish_service ??= (await import("../../Service/Publish/Port/PublishService.mjs")).PublishService.new(
            await this.#getHttpApi(),
            await (await this.#getConfigApi()).getConfig(
                GITHUB_CONFIG_TOKEN_KEY
            )
        );

        return this.#publish_service;
    }
}
