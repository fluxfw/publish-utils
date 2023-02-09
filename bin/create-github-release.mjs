#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { METHOD_POST } from "../../flux-http-api/src/Adapter/Method/METHOD.mjs";

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

    const title = execFileSync("get-release-title", [
        path
    ], {
        encoding: "utf8"
    });

    const description = execFileSync("get-release-description", [
        path
    ], {
        encoding: "utf8"
    });

    const pre_release = tag.includes("alpha") || tag.includes("beta") || tag.includes("pre") || tag.includes("rc");

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
            body: description,
            prerelease: pre_release
        })
    });
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
