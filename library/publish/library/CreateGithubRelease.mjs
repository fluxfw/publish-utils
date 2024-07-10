import { BUILD_CONFIG_APPLICATION_ID } from "@publish-utils/build-config/BUILD_CONFIG.mjs";
import { GetGithubAuthorization } from "./GetGithubAuthorization.mjs";
import { GetGithubRepository } from "./GetGithubRepository.mjs";
import { GetReleaseDescription } from "./GetReleaseDescription.mjs";
import { GetReleaseTag } from "./GetReleaseTag.mjs";
import { GetReleaseTitle } from "./GetReleaseTitle.mjs";

export class CreateGithubRelease {
    /**
     * @returns {Promise<CreateGithubRelease>}
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
    async createGithubRelease(path) {
        const tag = await (await GetReleaseTag.new())
            .getReleaseTag(
                path
            );

        const title = await (await GetReleaseTitle.new())
            .getReleaseTitle(
                path
            );

        console.log(`Create github release ${title} from tag ${tag}`);

        const response = await fetch(`https://api.github.com/repos/${await (await GetGithubRepository.new())
            .getGithubRepository(
                path
            )}/releases`, {
            method: "POST",
            headers: {
                Authorization: await (await GetGithubAuthorization.new())
                    .getGithubAuthorization(),
                "Content-Type": "application/json",
                "User-Agent": BUILD_CONFIG_APPLICATION_ID
            },
            body: JSON.stringify({
                tag_name: tag,
                name: title,
                body: await (await GetReleaseDescription.new())
                    .getReleaseDescription(
                        path
                    ),
                prerelease: tag.includes("alpha") || tag.includes("beta") || tag.includes("pre") || tag.includes("rc")
            })
        });

        if (!response.ok) {
            throw response;
        }

        await response.body?.cancel();
    }
}
