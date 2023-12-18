import { GetReleaseChangelog } from "./GetReleaseChangelog.mjs";

export class GetReleaseDescription {
    /**
     * @returns {GetReleaseDescription}
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
    async getReleaseDescription(path) {
        const changelog = await GetReleaseChangelog.new()
            .getReleaseChangelog(
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
