/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class GetReleaseTag {
    /**
     * @type {FluxPublishUtils}
     */
    #flux_publish_utils;

    /**
     * @param {FluxPublishUtils} flux_publish_utils
     * @returns {GetReleaseTag}
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
    async getReleaseTag(path) {
        return `v${await this.#flux_publish_utils.getReleaseVersion(
            path
        )}`;
    }
}
