/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class GetReleaseVersion {
    /**
     * @type {FluxPublishUtils}
     */
    #flux_publish_utils;

    /**
     * @param {FluxPublishUtils} flux_publish_utils
     * @returns {GetReleaseVersion}
     */
    static new(flux_publish_utils) {
        return new this(
            flux_publish_utils
        );
    }

    /**
     * @param {FluxPublishUtils} flux_publish_utils
     * @private
     */
    constructor(flux_publish_utils) {
        this.#flux_publish_utils = flux_publish_utils;
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseVersion(path) {
        return (await this.#flux_publish_utils.getMetadata(
            path
        )).version ?? "";
    }
}
