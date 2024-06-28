import { join } from "node:path";
import { readFile } from "node:fs/promises";

export class GetChangelog {
    /**
     * @returns {Promise<GetChangelog>}
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
    async getChangelog(path) {
        return readFile(join(path, "CHANGELOG.md"), "utf8");
    }
}
