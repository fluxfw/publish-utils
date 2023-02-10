/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class GetReleaseTagCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {GetReleaseTagCommand}
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
    async getReleaseTag(path) {
        return `v${await this.#publish_service.getReleaseVersion(
            path
        )}`;
    }
}
