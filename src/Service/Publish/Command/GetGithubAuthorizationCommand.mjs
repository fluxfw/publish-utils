import { AUTHORIZATION_SCHEMA_BASIC } from "../../../../../flux-http-api/src/Authorization/AUTHORIZATION_SCHEMA.mjs";

export class GetGithubAuthorizationCommand {
    /**
     * @type {string}
     */
    #github_token;

    /**
     * @param {string} github_token
     * @returns {GetGithubAuthorizationCommand}
     */
    static new(github_token) {
        return new this(
            github_token
        );
    }

    /**
     * @param {string} github_token
     * @private
     */
    constructor(github_token) {
        this.#github_token = github_token;
    }

    /**
     * @returns {Promise<string>}
     */
    async getGithubAuthorization() {
        return `${AUTHORIZATION_SCHEMA_BASIC} ${btoa(this.#github_token)}`;
    }
}
