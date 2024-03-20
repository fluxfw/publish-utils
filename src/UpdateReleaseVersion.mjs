import { existsSync } from "node:fs";
import { GetChangelog } from "./GetChangelog.mjs";
import { GetReleaseVersion } from "./GetReleaseVersion.mjs";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";

export class UpdateReleaseVersion {
    /**
     * @returns {Promise<UpdateReleaseVersion>}
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
    async updateReleaseVersion(path) {
        console.log("Update version file");
        const version_file = join(path, "version");
        let old_version = null;
        if (existsSync(version_file)) {
            old_version = await (await GetReleaseVersion.new())
                .getReleaseVersion(
                    path
                );
        }

        const date = new Date();
        const new_version_date = `${`${date.getFullYear()}`.padStart(2, "0")}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;

        console.log(`- Old version: ${old_version}`);

        let new_version_increment = 0;
        if (old_version?.startsWith(new_version_date) ?? false) {
            new_version_increment = parseInt(old_version.substring(new_version_date.length + 1));
        }

        new_version_increment++;
        const new_version = `${new_version_date}-${new_version_increment}`;
        console.log(`- New version: ${new_version}`);

        await writeFile(version_file, `${new_version}\n`);

        const tag = `v${new_version}`;

        console.log("Update CHANGELOG.md");
        const changelog_md_file = join(path, "CHANGELOG.md");
        let changelog;
        if (existsSync(changelog_md_file)) {
            changelog = await (await GetChangelog.new())
                .getChangelog(
                    path
                );
        }
        changelog ??= null;
        if ((changelog?.trim() ?? "") === "") {
            changelog = "# Changelog\n\n    ## latest\n    \n    Changes:\n    \n    \\-\n    ";
        }

        const latest_start_position = changelog.indexOf("\n## latest");
        if (latest_start_position === -1) {
            throw new Error("Missing latest changelog entry");
        }
        let old_latest_changelog = changelog.substring(latest_start_position + 1);

        const latest_end_position = old_latest_changelog.indexOf("\n## ");
        if (latest_end_position !== -1) {
            old_latest_changelog = old_latest_changelog.substring(0, latest_end_position);
        }

        const new_version_changelog = old_latest_changelog.replace("latest", tag);

        const new_latest_changelog = old_latest_changelog.replace(/Changes\s*:\s*(.+\n)+\n*/, "Changes:\n\n\\-\n");

        changelog = changelog.replace(old_latest_changelog, `${new_latest_changelog}\n${new_version_changelog}`);

        await writeFile(changelog_md_file, changelog);
    }
}
