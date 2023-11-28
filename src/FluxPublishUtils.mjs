import { CONFIG_ENV_PREFIX } from "./Config/CONFIG.mjs";
import { GITHUB_CONFIG_TOKEN_KEY } from "./Github/GITHUB_CONFIG.mjs";

/** @typedef {import("../../flux-config/src/FluxConfig.mjs").FluxConfig} FluxConfig */
/** @typedef {import("../../flux-http/src/FluxHttp.mjs").FluxHttp} FluxHttp */
/** @typedef {import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs").FluxShutdownHandler} FluxShutdownHandler */

export class FluxPublishUtils {
    /**
     * @type {FluxConfig | null}
     */
    #flux_config = null;
    /**
     * @type {FluxHttp | null}
     */
    #flux_http = null;
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
            await this.#getFluxHttp(),
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
            await (await this.#getFluxConfig()).getConfig(
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
        return (await import("./Publish/GetReleaseVersion.mjs")).GetReleaseVersion.new()
            .getReleaseVersion(
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
            await this.#getFluxHttp(),
            this
        )
            .uploadAssetToGithubRelease(
                path,
                asset_path,
                asset_name
            );
    }

    /**
     * @returns {Promise<FluxConfig>}
     */
    async #getFluxConfig() {
        this.#flux_config ??= (await import("../../flux-config/src/FluxConfig.mjs")).FluxConfig.new(
            await (await import("../../flux-config/src/getValueProviders.mjs")).getValueProviders(
                CONFIG_ENV_PREFIX,
                false
            )
        );

        return this.#flux_config;
    }

    /**
     * @returns {Promise<FluxHttp>}
     */
    async #getFluxHttp() {
        this.#flux_http ??= (await import("../../flux-http/src/FluxHttp.mjs")).FluxHttp.new(
            this.#flux_shutdown_handler
        );

        return this.#flux_http;
    }
}
