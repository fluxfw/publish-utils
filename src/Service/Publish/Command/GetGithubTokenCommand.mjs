import { readFile } from "node:fs/promises";

export class GetGithubTokenCommand {
    /**
     * @returns {GetGithubTokenCommand}
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
     * @returns {Promise<string>}
     */
    async getGithubToken() {
        return (await readFile(process.env["FLUX_PUBLISH_UTILS_GITHUB_TOKEN_FILE"], "utf8")).trim();
    }
}
