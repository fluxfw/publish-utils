import { Config } from "config/Config.mjs";
import { CONFIG_ENV_PREFIX } from "../Config/CONFIG.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

const GITEA_CONFIG_TOKEN_KEY = "gitea-token";

export class GetGiteaConfig {
    /**
     * @type {Config}
     */
    #config;

    /**
     * @returns {Promise<GetGiteaConfig>}
     */
    static async new() {
        return new this(
            await Config.new(
                await getValueProviders(
                    null,
                    CONFIG_ENV_PREFIX
                )
            )
        );
    }

    /**
     * @param {Config} config
     * @private
     */
    constructor(config) {
        this.#config = config;
    }

    /**
     * @param {string} path
     * @returns {Promise<{authorization: string, host: string, repository: string}>}
     */
    async getGiteaConfig(path) {
        return {
            authorization: await this.#getAuthorization(),
            ...await this.#getHostAndRepository(
                path
            )
        };
    }

    /**
     * @returns {Promise<string>}
     */
    async #getAuthorization() {
        return `token ${await this.#config.getConfig(
            GITEA_CONFIG_TOKEN_KEY,
            CONFIG_TYPE_STRING
        )}`;
    }

    /**
     * @param {string} path
     * @returns {Promise<{host: string, url: string}>}
     */
    async #getHostAndRepository(path) {
        const [
            ,
            url
        ] = (await readFile(join(path, ".git", "config"), "utf8")).match(/\[remote "[^"]+"\]\s+url *= *(.+)\s/);

        const _url = new URL(url.startsWith("git@") ? `https://${url.replace(":", "/")}` : url);

        return {
            host: _url.origin,
            repository: _url.pathname.substring(1).replace(/\.git$/, "")
        };
    }
}
