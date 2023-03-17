import { join } from "node:path/posix";
import { readFile, writeFile } from "node:fs/promises";

/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class UpdateGetReleaseTagCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {UpdateGetReleaseTagCommand}
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
     * @returns {Promise<string>}
     */
    async updateGetReleaseTag(path) {
        const tag = await this.#publish_service.getReleaseTag(
            path
        );

        const get_release_tag_sh_file = join(path, ".local", "bin", "get-release-tag.sh");

        await writeFile(get_release_tag_sh_file, (await readFile(get_release_tag_sh_file, "utf8")).replace(/tag="v[0-9-]+"/, `tag="${tag}"`));

        return tag;
    }
}
