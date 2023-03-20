/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class GetReleaseChangelog {
    /**
     * @type {FluxPublishUtils}
     */
    #flux_publish_utils;

    /**
     * @param {FluxPublishUtils} flux_publish_utils
     * @returns {GetReleaseChangelog}
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
    async getReleaseChangelog(path) {
        let changelog = await this.#flux_publish_utils.getChangelog(
            path
        );

        const changelog_start_position = changelog.indexOf(`\n## ${await this.#flux_publish_utils.getReleaseTag(
            path
        )}`);

        if (changelog_start_position === -1) {
            return "";
        }

        changelog = changelog.substring(changelog_start_position + 1);

        const changelog_end_position = changelog.indexOf("\n## ");

        if (changelog_end_position !== -1) {
            changelog = changelog.substring(0, changelog_end_position - 1);
        }

        return changelog.trim();
    }
}
