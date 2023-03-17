/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class GetReleaseChangelogCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {GetReleaseChangelogCommand}
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
    async getReleaseChangelog(path) {
        let changelog = await this.#publish_service.getChangelog(
            path
        );

        const changelog_start_position = changelog.indexOf(`\n## ${await this.#publish_service.getReleaseTag(
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
