import { GetReleaseVersion } from "./GetReleaseVersion.mjs";

export class GetReleaseTag {
    /**
     * @returns {Promise<GetReleaseTag>}
     */
    static async new() {
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
        return `v${await (await GetReleaseVersion.new())
            .getReleaseVersion(
                path
            )}`;
    }
}
