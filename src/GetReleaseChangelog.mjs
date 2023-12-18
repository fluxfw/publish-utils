import { GetChangelog } from "./GetChangelog.mjs";
import { GetReleaseTag } from "./GetReleaseTag.mjs";

export class GetReleaseChangelog {
    /**
     * @returns {GetReleaseChangelog}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async getReleaseChangelog(path) {
        let changelog = await GetChangelog.new()
            .getChangelog(
                path
            );

        const changelog_start_position = changelog.indexOf(`\n## ${await GetReleaseTag.new()
            .getReleaseTag(
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
