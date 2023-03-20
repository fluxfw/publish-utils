/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class GetReleaseDescription {
    /**
     * @type {FluxPublishUtils}
     */
    #flux_publish_utils;

    /**
     * @param {FluxPublishUtils} flux_publish_utils
     * @returns {GetReleaseDescription}
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
    async getReleaseDescription(path) {
        const changelog = await this.#flux_publish_utils.getReleaseChangelog(
            path
        );

        const description_header_end_position = changelog.indexOf("\n");

        let description = "";
        if (description_header_end_position !== -1) {
            description = changelog.substring(description_header_end_position + 1);
        }

        return description.trim();
    }
}
