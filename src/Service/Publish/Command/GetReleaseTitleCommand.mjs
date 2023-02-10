/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class GetReleaseTitleCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {GetReleaseTitleCommand}
     */
    static new(publish_service) {
        return new this(
            publish_service
        );
    }

    /**
     * @param {PublishService} publish_service
     * @private
     */
    constructor(publish_service) {
        this.#publish_service = publish_service;
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseTitle(path) {
        const tag = await this.#publish_service.getReleaseTag(
            path
        );

        const changelog = await this.#publish_service.getReleaseChangelog(
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
