import { execFileSync } from "node:child_process";
import { basename, join } from "node:path/posix";

/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class UploadAssetToGithubReleaseCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {UploadAssetToGithubReleaseCommand}
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
     * @param {string} asset_path
     * @param {string | null} asset_name
     * @returns {Promise<void>}
     */
    async uploadAssetToGithubRelease(path, asset_path, asset_name = null) {
        const _asset_name = asset_name ?? basename(asset_path);

        const tag = await this.#publish_service.getReleaseTag(
            path
        );

        console.log(`Upload asset ${asset_path} as ${_asset_name} to github release ${tag}`);

        /*const release_id = JSON.parse(execFileSync("gh", [
            "api",
            "--method",
            METHOD_GET,
            `/repos/{owner}/{repo}/releases/tags/${tag}`
        ], {
            cwd: path,
            encoding: "utf8"
        })).id;

        execFileSync("gh", [
            "api",
            "--method",
            METHOD_POST,
            "--hostname",
            "uploads.github.com",
            `/repos/{owner}/{repo}/releases/${release_id}/assets`,
            "-f",
            `name=${_asset_name}`,
            "--input",
            join(path, asset_path)
        ], {
            cwd: path
        });*/

        execFileSync("gh", [
            "release",
            "upload",
            tag,
            `${join(path, asset_path)}#${_asset_name}`
        ], {
            cwd: path
        });
    }
}
