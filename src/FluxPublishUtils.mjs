import { CONFIG_ENV_PREFIX } from "./Config/CONFIG.mjs";
import { GITHUB_CONFIG_TOKEN_KEY } from "./Github/GITHUB_CONFIG.mjs";

/** @typedef {import("../../flux-config-api/src/FluxConfigApi.mjs").FluxConfigApi} FluxConfigApi */
/** @typedef {import("../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs").FluxShutdownHandler} FluxShutdownHandler */
/** @typedef {import("./Metadata/Metadata.mjs").Metadata} Metadata */

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
        await (await import("./Publish/CreateGithubRelease.mjs")).CreateGithubRelease.new(
            await this.#getFluxHttpApi(),
            this
        )
            .createGithubRelease(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getChangelog(path) {
        return (await import("./Publish/GetChangelog.mjs")).GetChangelog.new()
            .getChangelog(
                path
            );
    }

    /**
     * @returns {Promise<string>}
     */
    async getGithubAuthorization() {
        return (await import("./Publish/GetGithubAuthorization.mjs")).GetGithubAuthorization.new(
            await (await this.#getFluxConfigApi()).getConfig(
                GITHUB_CONFIG_TOKEN_KEY
            )
        )
            .getGithubAuthorization();
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getGithubRepository(path) {
        return (await import("./Publish/GetGithubRepository.mjs")).GetGithubRepository.new()
            .getGithubRepository(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<Metadata>}
     */
    async getMetadata(path) {
        return (await import("./Publish/GetMetadata.mjs")).GetMetadata.new()
            .getMetadata(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseChangelog(path) {
        return (await import("./Publish/GetReleaseChangelog.mjs")).GetReleaseChangelog.new(
            this
        )
            .getReleaseChangelog(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseDescription(path) {
        return (await import("./Publish/GetReleaseDescription.mjs")).GetReleaseDescription.new(
            this
        )
            .getReleaseDescription(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseTag(path) {
        return (await import("./Publish/GetReleaseTag.mjs")).GetReleaseTag.new(
            this
        )
            .getReleaseTag(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseTitle(path) {
        return (await import("./Publish/GetReleaseTitle.mjs")).GetReleaseTitle.new(
            this
        )
            .getReleaseTitle(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseVersion(path) {
        return (await import("./Publish/GetReleaseVersion.mjs")).GetReleaseVersion.new(
            this
        )
            .getReleaseVersion(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async updateGetReleaseTag(path) {
        return (await import("./Publish/UpdateGetReleaseTag.mjs")).UpdateGetReleaseTag.new(
            this
        )
            .updateGetReleaseTag(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async updateGithubMetadata(path) {
        await (await import("./Publish/UpdateGithubMetadata.mjs")).UpdateGithubMetadata.new(
            await this.#getFluxHttpApi(),
            this
        )
            .updateGithubMetadata(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async updateReleaseVersion(path) {
        await (await import("./Publish/UpdateReleaseVersion.mjs")).UpdateReleaseVersion.new(
            this
        )
            .updateReleaseVersion(
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
        await (await import("./Publish/UploadAssetToGithubRelease.mjs")).UploadAssetToGithubRelease.new(
            await this.#getFluxHttpApi(),
            this
        )
            .uploadAssetToGithubRelease(
                path,
                asset_path,
                asset_name
            );
    }

    /**
     * @returns {Promise<FluxConfigApi>}
     */
    async #getFluxConfigApi() {
        this.#flux_config_api ??= (await import("../../flux-config-api/src/FluxConfigApi.mjs")).FluxConfigApi.new(
            await (await import("../../flux-config-api/src/getValueProviderImplementations.mjs")).getValueProviderImplementations(
                CONFIG_ENV_PREFIX,
                false
            )
        );

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
}
