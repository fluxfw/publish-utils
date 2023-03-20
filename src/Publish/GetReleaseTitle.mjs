/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class GetReleaseTitle {
    /**
     * @type {FluxPublishUtils}
     */
    #flux_publish_utils;

    /**
     * @param {FluxPublishUtils} flux_publish_utils
     * @returns {GetReleaseTitle}
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
    async getReleaseTitle(path) {
        const tag = await this.#flux_publish_utils.getReleaseTag(
            path
        );

        const changelog = await this.#flux_publish_utils.getReleaseChangelog(
            path
        );

        const title_header_end_position = changelog.indexOf("\n");

        let title = "";
        if (title_header_end_position !== -1) {
            title = changelog.substring(3 + tag.length, title_header_end_position);
        }

        title = title.trim();

        if (title === "") {
            title = tag;
        }

        return title;
    }
}
