import { GetGiteaConfig } from "../Gitea/GetGiteaConfig.mjs";
import { GetReleaseDescription } from "./GetReleaseDescription.mjs";
import { GetReleaseTag } from "./GetReleaseTag.mjs";
import { GetReleaseTitle } from "./GetReleaseTitle.mjs";

export class CreateGiteaRelease {
    /**
     * @returns {Promise<CreateGiteaRelease>}
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
    async createGiteaRelease(path) {
        const tag = await (await GetReleaseTag.new())
            .getReleaseTag(
                path
            );

        const title = await (await GetReleaseTitle.new())
            .getReleaseTitle(
                path
            );

        console.log(`Create gitea release ${title} from tag ${tag}`);

        const gitea_config = await (await GetGiteaConfig.new())
            .getGiteaConfig(
                path
            );

        const response = await fetch(`${gitea_config.host}/api/v1/repos/${gitea_config.repository}/releases`, {
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
                Authorization: gitea_config.authorization,
                "Content-Type": "application/json"
            },
            method: "POST",
            ...gitea_config["https-certificate-options"]
        });

        if (!response.ok) {
            throw response;
        }

        await response.body?.cancel();
    }
}
