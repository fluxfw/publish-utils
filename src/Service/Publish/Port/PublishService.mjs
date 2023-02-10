/** @typedef {import("../../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../../../Adapter/Metadata/Metadata.mjs").Metadata} Metadata */

export class PublishService {
    /**
     * @type {HttpApi}
     */
    #http_api;

    /**
     * @param {HttpApi} http_api
     * @returns {PublishService}
     */
    static new(http_api) {
        return new this(
            http_api
        );
    }

    /**
     * @param {HttpApi} http_api
     * @private
     */
    constructor(http_api) {
        this.#http_api = http_api;
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async createGithubRelease(path) {
        await (await import("../Command/CreateGithubReleaseCommand.mjs")).CreateGithubReleaseCommand.new(
            this.#http_api,
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
        return (await import("../Command/GetChangelogCommand.mjs")).GetChangelogCommand.new()
            .getChangelog(
                path
            );
    }

    /**
     * @returns {Promise<string>}
     */
    async getGithubAuthorization() {
        return (await import("../Command/GetGithubAuthorizationCommand.mjs")).GetGithubAuthorizationCommand.new(
            this
        )
            .getGithubAuthorization();
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getGithubRepository(path) {
        return (await import("../Command/GetGithubRepositoryCommand.mjs")).GetGithubRepositoryCommand.new()
            .getGithubRepository(
                path
            );
    }

    /**
     * @returns {Promise<string>}
     */
    async getGithubToken() {
        return (await import("../Command/GetGithubTokenCommand.mjs")).GetGithubTokenCommand.new()
            .getGithubToken();
    }

    /**
     * @param {string} path
     * @returns {Promise<Metadata>}
     */
    async getMetadata(path) {
        return (await import("../Command/GetMetadataCommand.mjs")).GetMetadataCommand.new()
            .getMetadata(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseChangelog(path) {
        return (await import("../Command/GetReleaseChangelogCommand.mjs")).GetReleaseChangelogCommand.new(
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
        return (await import("../Command/GetReleaseDescriptionCommand.mjs")).GetReleaseDescriptionCommand.new(
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
        return (await import("../Command/GetReleaseTagCommand.mjs")).GetReleaseTagCommand.new(
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
        return (await import("../Command/GetReleaseTitleCommand.mjs")).GetReleaseTitleCommand.new(
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
        return (await import("../Command/GetReleaseVersionCommand.mjs")).GetReleaseVersionCommand.new(
            this
        )
            .getReleaseVersion(
                path
            );
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async updateGithubMetadata(path) {
        await (await import("../Command/UpdateGithubMetadataCommand.mjs")).UpdateGithubMetadataCommand.new(
            this.#http_api,
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
        await (await import("../Command/UpdateReleaseVersionCommand.mjs")).UpdateReleaseVersionCommand.new(
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
        await (await import("../Command/UploadAssetToGithubReleaseCommand.mjs")).UploadAssetToGithubReleaseCommand.new(
            this.#http_api,
            this
        )
            .uploadAssetToGithubRelease(
                path,
                asset_path,
                asset_name
            );
    }
}
