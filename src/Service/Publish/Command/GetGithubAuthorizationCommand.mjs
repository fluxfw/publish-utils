/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class GetGithubAuthorizationCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {GetGithubAuthorizationCommand}
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
     * @returns {Promise<string>}
     */
    async getGithubAuthorization() {
        return `Basic ${btoa(await this.#publish_service.getGithubToken())}`;
    }
}
