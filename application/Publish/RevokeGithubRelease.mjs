import { BUILD_CONFIG_APPLICATION_ID } from "../Build/BUILD_CONFIG.mjs";
import { GetGithubAuthorization } from "./GetGithubAuthorization.mjs";
import { GetGithubRepository } from "./GetGithubRepository.mjs";
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

        const repository = await (await GetGithubRepository.new())
            .getGithubRepository(
                path
            );

        const authorization = await (await GetGithubAuthorization.new())
            .getGithubAuthorization();

        const response = await fetch(`https://api.github.com/repos/${repository}/releases/tags/${tag}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: authorization,
                "User-Agent": BUILD_CONFIG_APPLICATION_ID
            }
        });

        if (!response.ok || !(response.headers.get("Content-Type")?.includes("application/json") ?? false)) {
            throw response;
        }

        const _response = await fetch(`https://api.github.com/repos/${repository}/releases/${(await response.json()).id}`, {
            method: "DELETE",
            headers: {
                Authorization: authorization,
                "User-Agent": BUILD_CONFIG_APPLICATION_ID
            }
        });

        if (!_response.ok) {
            throw _response;
        }

        await _response.body?.cancel();
    }
}
