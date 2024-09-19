import { GetGihubConfig } from "../Github/GetGihubConfig.mjs";
import { GetReleaseTag } from "./GetReleaseTag.mjs";

export class RevokeGithubRelease {
    /**
     * @returns {Promise<RevokeGithubRelease>}
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
    async revokeGithubRelease(path) {
        const tag = await (await GetReleaseTag.new())
            .getReleaseTag(
                path
            );

        console.log(`Revoke github release ${tag}`);

        const github_config = await (await GetGihubConfig.new())
            .getGithubConfig(
                path
            );

        const response = await fetch(`https://api.github.com/repos/${github_config.repository}/releases/tags/${tag}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: github_config.authorization,
                "User-Agent": github_config["user-agent"]
            }
        });

        if (!response.ok || !(response.headers.get("Content-Type")?.includes("application/json") ?? false)) {
            throw response;
        }

        const _response = await fetch(`https://api.github.com/repos/${github_config.repository}/releases/${(await response.json()).id}`, {
            headers: {
                Authorization: github_config.authorization,
                "User-Agent": github_config["user-agent"]
            },
            method: "DELETE"
        });

        if (!_response.ok) {
            throw _response;
        }

        await _response.body?.cancel();
    }
}
