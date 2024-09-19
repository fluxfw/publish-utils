import { GetGiteaConfig } from "../Gitea/GetGiteaConfig.mjs";
import { GetReleaseTag } from "./GetReleaseTag.mjs";

export class RevokeGiteaRelease {
    /**
     * @returns {Promise<RevokeGiteaRelease>}
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
     * @returns {Promise<void>}
     */
    async revokeGiteaRelease(path) {
        const tag = await (await GetReleaseTag.new())
            .getReleaseTag(
                path
            );

        console.log(`Revoke gitea release ${tag}`);

        const gitea_config = await (await GetGiteaConfig.new())
            .getGiteaConfig(
                path
            );

        const response = await fetch(`${gitea_config.host}/api/v1/repos/${gitea_config.repository}/releases/tags/${tag}`, {
            headers: {
                Authorization: gitea_config.authorization
            },
            method: "DELETE",
            ...gitea_config["https-certificate-options"]
        });

        if (!response.ok) {
            throw response;
        }

        await response.body?.cancel();
    }
}
