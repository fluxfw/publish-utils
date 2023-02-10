/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class GetReleaseDescriptionCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {GetReleaseDescriptionCommand}
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
    async getReleaseDescription(path) {
        const changelog = await this.#publish_service.getReleaseChangelog(
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
