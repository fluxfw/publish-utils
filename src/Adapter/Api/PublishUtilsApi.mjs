/** @typedef {import("../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../../Service/Publish/Port/PublishService.mjs").PublishService} PublishService */

export class PublishUtilsApi {
    /**
     * @type {HttpApi | null}
     */
    #http_api = null;
    /**
     * @type {PublishService | null}
     */
    #publish_service = null;

    /**
     * @returns {PublishUtilsApi}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

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
     * @returns {Promise<HttpApi>}
     */
    async #getHttpApi() {
        this.#http_api ??= (await import("../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs")).HttpApi.new();

        return this.#http_api;
    }

    /**
     * @returns {Promise<PublishService>}
     */
    async #getPublishService() {
        this.#publish_service ??= (await import("../../Service/Publish/Port/PublishService.mjs")).PublishService.new(
            await this.#getHttpApi()
        );

        return this.#publish_service;
    }
}
