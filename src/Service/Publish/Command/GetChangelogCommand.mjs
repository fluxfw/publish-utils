import { join } from "node:path/posix";
import { readFile } from "node:fs/promises";

export class GetChangelogCommand {
    /**
     * @returns {GetChangelogCommand}
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
    async getChangelog(path) {
        return readFile(join(path, "CHANGELOG.md"), "utf8");
    }
}
