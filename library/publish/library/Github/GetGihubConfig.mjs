import { BUILD_CONFIG_APPLICATION_ID } from "@publish-utils/build-config/BuildConfig/BUILD_CONFIG.mjs";
import { Config } from "config/Config.mjs";
import { CONFIG_ENV_PREFIX } from "../Config/CONFIG.mjs";
import { CONFIG_TYPE_STRING } from "config/CONFIG_TYPE.mjs";
import { getValueProviders } from "config/getValueProviders.mjs";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

const GITHUB_CONFIG_TOKEN_KEY = "github-token";

export class GetGihubConfig {
    /**
     * @type {Config}
     */
    #config;

    /**
     * @returns {Promise<GetGihubConfig>}
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
     * @returns {Promise<{authorization: string, repository: string, "user-agent": string}>}
     */
    async getGithubConfig(path) {
        return {
            authorization: await this.#getAuthorization(),
            repository: await this.#getRepository(
                path
            ),
            "user-agent": this.#getUserAgent()
        };
    }

    /**
     * @returns {Promise<string>}
     */
    async #getAuthorization() {
        return `Basic ${btoa(await this.#config.getConfig(
            GITHUB_CONFIG_TOKEN_KEY,
            CONFIG_TYPE_STRING
        ))}`;
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async #getRepository(path) {
        const [
            ,
            url
        ] = (await readFile(join(path, ".git", "config"), "utf8")).match(/\[remote "[^"]+"\]\s+url *= *(.+)\s/);

        const _url = new URL(url.startsWith("git@") ? `https://${url.replace(":", "/")}` : url);

        if (_url.host !== "github.com") {
            throw new Error("No github repository!");
        }

        return _url.pathname.substring(1).replace(/\.git$/, "");
    }

    /**
     * @returns {string}
     */
    #getUserAgent() {
        return BUILD_CONFIG_APPLICATION_ID;
    }
}
