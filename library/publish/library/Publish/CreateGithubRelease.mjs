import { GetGihubConfig } from "../Github/GetGihubConfig.mjs";
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

        const github_config = await (await GetGihubConfig.new())
            .getGithubConfig(
                path
            );

        const response = await fetch(`https://api.github.com/repos/${github_config.repository}/releases`, {
            body: JSON.stringify({
                body: await (await GetReleaseDescription.new())
                    .getReleaseDescription(
                        path
                    ),
                name: title,
                prerelease: tag.includes("alpha") || tag.includes("beta") || tag.includes("pre") || tag.includes("rc"),
                tag_name: tag
            }),
            headers: {
                Authorization: github_config.authorization,
                "Content-Type": "application/json",
                "User-Agent": github_config["user-agent"]
            },
            method: "POST"
        });

        if (!response.ok) {
            throw response;
        }

        await response.body?.cancel();
    }
}
