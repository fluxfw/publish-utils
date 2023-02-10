import { execFileSync } from "node:child_process";
import { METHOD_PATCH, METHOD_PUT } from "../../../../../flux-http-api/src/Adapter/Method/METHOD.mjs";

/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class UpdateGithubMetadataCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {UpdateGithubMetadataCommand}
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
    async updateGithubMetadata(path) {
        const metadata = await this.#publish_service.getMetadata(
            path
        );

        console.log("Update github metadata");

        execFileSync("gh", [
            "api",
            "--method",
            METHOD_PATCH,
            "/repos/{owner}/{repo}",
            "--input",
            "-"
        ], {
            cwd: path,
            input: JSON.stringify({
                description: metadata.description ?? "",
                homepage: metadata.homepage ?? ""
            })
        });

        execFileSync("gh", [
            "api",
            "--method",
            METHOD_PUT,
            "/repos/{owner}/{repo}/topics",
            "--input",
            "-"
        ], {
            cwd: path,
            input: JSON.stringify({
                names: metadata.topics ?? []
            })
        });
    }
}
