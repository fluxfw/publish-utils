import { join } from "node:path/posix";
import { readFile } from "node:fs/promises";

/** @typedef {import("../../../Adapter/Metadata/Metadata.mjs").Metadata} Metadata */

export class GetMetadataCommand {
    /**
     * @returns {GetMetadataCommand}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} path
     * @returns {Promise<Metadata>}
     */
    async getMetadata(path) {
        return JSON.parse(await readFile(join(path, "metadata.json"), "utf8"));
    }
}
