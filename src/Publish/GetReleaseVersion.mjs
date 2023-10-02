import { join } from "node:path/posix";
import { readFile } from "node:fs/promises";

export class GetReleaseVersion {
    /**
     * @returns {GetReleaseVersion}
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
    async getReleaseVersion(path) {
        return (await readFile(join(path, "version"), "utf8")).trimEnd();
    }
}
