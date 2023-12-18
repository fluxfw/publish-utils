import { GetReleaseVersion } from "./GetReleaseVersion.mjs";

export class GetReleaseTag {
    /**
     * @returns {GetReleaseTag}
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
    async getReleaseTag(path) {
        return `v${await GetReleaseVersion.new()
            .getReleaseVersion(
                path
            )}`;
    }
}
