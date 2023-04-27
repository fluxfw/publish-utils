import { join } from "node:path/posix";
import { readFile, writeFile } from "node:fs/promises";

/** @typedef {import("../FluxPublishUtils.mjs").FluxPublishUtils} FluxPublishUtils */

export class UpdateGetReleaseTag {
    /**
     * @type {FluxPublishUtils}
     */
    #flux_publish_utils;

    /**
     * @param {FluxPublishUtils} flux_publish_utils
     * @returns {UpdateGetReleaseTag}
     */
    static new(flux_publish_utils) {
        return new this(
            flux_publish_utils
        );
    }

    /**
     * @param {FluxPublishUtils} flux_publish_utils
     * @private
     */
    constructor(flux_publish_utils) {
        this.#flux_publish_utils = flux_publish_utils;
    }

    /**
     * @param {string} path
     * @returns {Promise<string>}
     */
    async updateGetReleaseTag(path) {
        const tag = await this.#flux_publish_utils.getReleaseTag(
            path
        );

        const get_release_tag_sh_file = join(path, ".local", "bin", "get-release-tag.sh");

        await writeFile(get_release_tag_sh_file, (await readFile(get_release_tag_sh_file, "utf8")).replace(/tag="v[\d-]+"/, `tag="${tag}"`));

        return tag;
    }
}
