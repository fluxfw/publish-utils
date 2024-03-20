import { join } from "node:path";
import { readFile } from "node:fs/promises";

export class GetReleaseVersion {
    /**
     * @returns {Promise<GetReleaseVersion>}
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
    async getReleaseVersion(path) {
        return (await readFile(join(path, "version"), "utf8")).trimEnd();
    }
}
