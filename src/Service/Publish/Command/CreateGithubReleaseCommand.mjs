import { execFileSync } from "node:child_process";
import { METHOD_POST } from "../../../../../flux-http-api/src/Adapter/Method/METHOD.mjs";

/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class CreateGithubReleaseCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {CreateGithubReleaseCommand}
     */
    static new(publish_service) {
        return new this(
            publish_service
        );
    }

    /**
     * @param {PublishService} publish_service
     * @private
     */
    constructor(publish_service) {
        this.#publish_service = publish_service;
    }

    /**
     * @param {string} path
     * @returns {Promise<void>}
     */
    async createGithubRelease(path) {
        const tag = await this.#publish_service.getReleaseTag(
            path
        );

        const title = await this.#publish_service.getReleaseTitle(
            path
        );

        console.log(`Create github release ${title} from ${tag}`);

        execFileSync("gh", [
            "api",
            "--method",
            METHOD_POST,
            "/repos/{owner}/{repo}/releases",
            "--input",
            "-"
        ], {
            cwd: path,
            input: JSON.stringify({
                tag_name: tag,
                name: title,
                body: await this.#publish_service.getReleaseDescription(
                    path
                ),
                prerelease: tag.includes("alpha") || tag.includes("beta") || tag.includes("pre") || tag.includes("rc")
            })
        });
    }
}
