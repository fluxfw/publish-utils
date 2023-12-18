import { GetReleaseChangelog } from "./GetReleaseChangelog.mjs";
import { GetReleaseTag } from "./GetReleaseTag.mjs";

export class GetReleaseTitle {
    /**
     * @returns {GetReleaseTitle}
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
    async getReleaseTitle(path) {
        const tag = await GetReleaseTag.new()
            .getReleaseTag(
                path
            );

        const changelog = await GetReleaseChangelog.new()
            .getReleaseChangelog(
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
