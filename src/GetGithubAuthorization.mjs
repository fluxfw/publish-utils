import { CONFIG_ENV_PREFIX } from "./Config/CONFIG.mjs";
import { FluxConfig } from "flux-config/src/FluxConfig.mjs";
import { getValueProviders } from "flux-config/src/getValueProviders.mjs";
import { GITHUB_CONFIG_TOKEN_KEY } from "./Github/GITHUB_CONFIG.mjs";

export class GetGithubAuthorization {
    /**
     * @returns {Promise<GetGithubAuthorization>}
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
     * @returns {Promise<string>}
     */
    async getGithubAuthorization() {
        return `Basic ${btoa(await (await FluxConfig.new(
            await getValueProviders(
                false,
                CONFIG_ENV_PREFIX
            )
        ))
            .getConfig(
                GITHUB_CONFIG_TOKEN_KEY
            ))}`;
    }
}
