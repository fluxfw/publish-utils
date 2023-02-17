import { existsSync } from "node:fs";
import { join } from "node:path/posix";
import { readFile, writeFile } from "node:fs/promises";

/** @typedef {import("../Port/PublishService.mjs").PublishService} PublishService */

export class UpdateReleaseVersionCommand {
    /**
     * @type {PublishService}
     */
    #publish_service;

    /**
     * @param {PublishService} publish_service
     * @returns {UpdateReleaseVersionCommand}
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
    async updateReleaseVersion(path) {
        console.log("Update metadata.json");
        const metadata_json_file = join(path, "metadata.json");
        let metadata = {};
        if (existsSync(metadata_json_file)) {
            metadata = await this.#publish_service.getMetadata(
                path
            );
        }

        const date = new Date();
        const new_version_date = `${`${date.getFullYear()}`.padStart(2, "0")}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;

        const old_version = metadata.version ?? null;
        console.log(`- Old version: ${old_version}`);

        let new_version_increment = 0;
        if (old_version?.startsWith(new_version_date) ?? false) {
            new_version_increment = parseInt(old_version.substring(new_version_date.length + 1));
        }

        new_version_increment++;
        const new_version = `${new_version_date}-${new_version_increment}`;
        console.log(`- New version: ${new_version}`);

        metadata.version = new_version;

        await writeFile(metadata_json_file, `${JSON.stringify(metadata, null, 4)}\n`);

        console.log("Update CHANGELOG.md");
        const changelog_md_file = join(path, "CHANGELOG.md");
        let changelog;
        if (existsSync(changelog_md_file)) {
            changelog = await this.#publish_service.getChangelog(
                path
            );
        }
        changelog ??= null;
        if ((changelog?.trim() ?? "") === "") {
            changelog = `# Changelog

    ## latest
    
    Changes:
    
    \\-
    `;
        }

        const latest_start_position = changelog.indexOf("## latest");
        if (latest_start_position === -1) {
            throw new Error("Missing latest changelog entry");
        }
        let old_latest_changelog = changelog.substring(latest_start_position);

        const latest_end_position = old_latest_changelog.indexOf("\n## ");
        if (latest_end_position !== -1) {
            old_latest_changelog = old_latest_changelog.substring(0, latest_end_position);
        }

        const new_version_changelog = old_latest_changelog.replace("latest", `v${new_version}`);

        const new_latest_changelog = old_latest_changelog.replace(/Changes\s*:\s*(.+\n)+\n*/, `Changes:

\\-
`);

        changelog = changelog.replace(old_latest_changelog, `${new_latest_changelog}
${new_version_changelog}`);

        await writeFile(changelog_md_file, changelog);

        const plugin_php_file = join(path, "plugin.php");
        if (existsSync(plugin_php_file)) {
            console.log("Update plugin.php");

            let plugin = await readFile(plugin_php_file, "utf8");

            const plugin_new_version = new_version_date.replaceAll("-", ".");
            console.log(`- New version: ${plugin_new_version}`);

            plugin = plugin.replace(/\$version\s*=\s*["'][0-9.]+["']/, `$version = "${plugin_new_version}"`);

            await writeFile(plugin_php_file, plugin);
        }
    }
}
