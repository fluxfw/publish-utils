/** @typedef {import("../../../Adapter/Metadata/Metadata.mjs").Metadata} Metadata */

export class PublishService {
    /**
     * @returns {PublishService}
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
        await (await import("../Command/CreateGithubReleaseCommand.mjs")).CreateGithubReleaseCommand.new(
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
            this
        )
            .uploadAssetToGithubRelease(
                path,
                asset_path,
                asset_name
            );
    }
}
