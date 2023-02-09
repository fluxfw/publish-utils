#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path/posix";
import { readFile } from "node:fs/promises";

let shutdown_handler = null;
try {
    shutdown_handler = await (await import("../../flux-shutdown-handler-api/src/Adapter/Api/ShutdownHandlerApi.mjs")).ShutdownHandlerApi.new()
        .getShutdownHandler();

    const path = process.argv[2] ?? null;
    if (path === null) {
        throw new Error("Please pass a path");
    }

    const tag = execFileSync("get-release-tag", [
        path
    ], {
        encoding: "utf8"
    });

    const changelog_md_file = join(path, "CHANGELOG.md");
    if (!existsSync(changelog_md_file)) {
        throw new Error(`Missing ${changelog_md_file}`);
    }

    let changelog = await readFile(changelog_md_file, "utf8");

    const changelog_start_position = changelog.indexOf(`## ${tag}`);
    if (changelog_start_position === -1) {
        throw new Error(`Missing entry for ${tag} in ${changelog_md_file}`);
    }

    changelog = changelog.substring(changelog_start_position);

    const changelog_end_position = changelog.indexOf("\n## ");
    if (changelog_end_position !== -1) {
        changelog = changelog.substring(0, changelog_end_position - 1);
    }

    changelog = changelog.trim();

    process.stdout.write(changelog);
} catch (error) {
    console.error(error);

    if (shutdown_handler !== null) {
        await shutdown_handler.shutdown(
            1
        );
    } else {
        process.exit(1);
    }
}
