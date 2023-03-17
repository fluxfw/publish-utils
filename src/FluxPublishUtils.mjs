import { CONFIG_ENV_PREFIX } from "./Config/CONFIG.mjs";
import { GITHUB_CONFIG_TOKEN_KEY } from "./Github/GITHUB_CONFIG.mjs";

/** @typedef {import("../../flux-config-api/src/FluxConfigApi.mjs").FluxConfigApi} FluxConfigApi */
/** @typedef {import("../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs").FluxShutdownHandler} FluxShutdownHandler */
/** @typedef {import("./Publish/Port/PublishService.mjs").PublishService} PublishService */

export class FluxPublishUtils {
    /**
     * @type {FluxConfigApi | null}
     */
    #flux_config_api = null;
    /**
     * @type {FluxHttpApi | null}
     */
    #flux_http_api = null;
    /**
     * @type {FluxShutdownHandler}
     */
    #flux_shutdown_handler;
    /**
     * @type {PublishService | null}
     */
    #publish_service = null;

    /**
     * @param {FluxShutdownHandler} flux_shutdown_handler
     * @returns {FluxPublishUtils}
     */
    static new(flux_shutdown_handler) {
        return new this(
            flux_shutdown_handler
        );
    }

    /**
     * @param {FluxShutdownHandler} flux_shutdown_handler
     * @private
     */
    constructor(flux_shutdown_handler) {
        this.#flux_shutdown_handler = flux_shutdown_handler;
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
     * @returns {Promise<string>}
     */
    async updateGetReleaseTag(path) {
        return (await this.#getPublishService()).updateGetReleaseTag(
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
     * @returns {Promise<FluxConfigApi>}
     */
    async #getFluxConfigApi() {
        if (this.#flux_config_api === null) {
            const { CliParamValueProviderImplementation } = await import("../../flux-config-api/src/ValueProviderImplementation/CliParamValueProviderImplementation.mjs");

            this.#flux_config_api ??= (await import("../../flux-config-api/src/FluxConfigApi.mjs")).FluxConfigApi.new(
                (await (await import("../../flux-config-api/src/getValueProviderImplementations.mjs")).getValueProviderImplementations(
                    CONFIG_ENV_PREFIX
                )).filter(value_provider_implementation => !(value_provider_implementation instanceof CliParamValueProviderImplementation))
            );
        }

        return this.#flux_config_api;
    }

    /**
     * @returns {Promise<FluxHttpApi>}
     */
    async #getFluxHttpApi() {
        this.#flux_http_api ??= (await import("../../flux-http-api/src/FluxHttpApi.mjs")).FluxHttpApi.new(
            this.#flux_shutdown_handler
        );

        return this.#flux_http_api;
    }

    /**
     * @returns {Promise<PublishService>}
     */
    async #getPublishService() {
        this.#publish_service ??= (await import("./Publish/Port/PublishService.mjs")).PublishService.new(
            await this.#getFluxHttpApi(),
            await (await this.#getFluxConfigApi()).getConfig(
                GITHUB_CONFIG_TOKEN_KEY
            )
        );

        return this.#publish_service;
    }
}
