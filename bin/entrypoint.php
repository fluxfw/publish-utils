#!/usr/bin/env php
<?php

function getEnvironmentVariable(string $variable) : string
{
    $value = strval(filter_input(INPUT_ENV, $variable));

    if (empty($value)) {
        echo "Environment variable " . $variable . " not set!\n";
        die(1);
    }

    return $value;
}

function request(string $request_url, callable $set_token, int $expect_status_code, string $method = "GET", ?array $body_data = null) : ?string
{
    $curl = null;
    $response = null;
    $status_code = null;
    try {
        echo "curl " . $method . " request: " . $request_url . "\n";

        $curl = curl_init($request_url);

        $headers = [
            "User-Agent" => "FluxPublishUtils"
        ];

        $set_token($curl, $headers);

        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);

        if (!empty($body_data)) {
            //echo "Body data: " . json_encode($body_data) . "\n";
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($body_data));
            $headers["Content-Type"] = "application/json";
        }

        //echo "Headers: " . json_encode($headers) . "\n";
        curl_setopt($curl, CURLOPT_HTTPHEADER, array_map(fn(string $key, string $value) : string => $key . ": " . $value, array_keys($headers), $headers));

        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($curl);
        //echo "Response: " . $response . "\n";

        $status_code = intval(curl_getinfo($curl, CURLINFO_HTTP_CODE));
        echo "Status code: " . $status_code . "\n";
    } finally {
        if ($curl !== null) {
            curl_close($curl);
        }
    }
    if ($status_code !== $expect_status_code) {
        echo "Expect status code: " . $expect_status_code . "\n";
        die(1);
    }

    return $response;
}

function gitlabRequest(string $api_url, int $expect_status_code, string $method = "GET", ?array $body_data = null) : ?string
{
    static $FLUX_PUBLISH_UTILS_TOKEN = null;
    if ($FLUX_PUBLISH_UTILS_TOKEN === null) {
        $FLUX_PUBLISH_UTILS_TOKEN = getEnvironmentVariable("FLUX_PUBLISH_UTILS_TOKEN");
    }

    static $SERVER_URL = null;
    if ($SERVER_URL === null) {
        $SERVER_URL = getEnvironmentVariable("CI_SERVER_URL");
    }

    static $PROJECT_ID = null;
    if ($PROJECT_ID === null) {
        $PROJECT_ID = getEnvironmentVariable("CI_PROJECT_ID");
    }

    $request_url = $SERVER_URL . "/api/v4/projects/" . $PROJECT_ID . (!empty($api_url) ? "/" . $api_url : "");

    return request($request_url, function (CurlHandle $curl, array &$headers) use ($FLUX_PUBLISH_UTILS_TOKEN) : void {
        $headers["PRIVATE-TOKEN"] = $FLUX_PUBLISH_UTILS_TOKEN;
    }, $expect_status_code, $method, $body_data);
}

function githubRequest(string $api_url, int $expect_status_code, string $method = "GET", ?array $body_data = null) : ?string
{
    global $github_url, $github_token;
    if (empty($github_url) || empty($github_token)) {
        return null;
    }

    $request_url = $github_url . (!empty($api_url) ? "/" . $api_url : "");

    return request($request_url, function (CurlHandle $curl, array &$headers) use ($github_token) : void {
        curl_setopt($curl, CURLOPT_USERPWD, $github_token);
        $headers["Accept"] = "application/vnd.github.mercy-preview+json";
    }, $expect_status_code, $method, $body_data);
}

if (php_sapi_name() !== "cli") {
    die();
}

echo "> Collect needed infos\n";

$build_dir = getEnvironmentVariable("CI_PROJECT_DIR");

if (!file_exists($info_json_file = $build_dir . "/metadata.json")) {
    if (!file_exists($info_json_file = $build_dir . "/composer.json")) {
        if (!file_exists($info_json_file = $build_dir . "/package.json")) {
            echo "Neither metadata.json or composer.json or package.json found!\n";
            die(1);
        }
    }
}

$info_json = json_decode(file_get_contents($info_json_file));

$create_tag = true;

$version = $info_json->version ?? null;
if (empty($version)) {
    $create_tag = false;
}

$description = $info_json->description ?? null;
if (empty($description)) {
    echo "Short description not available in " . basename($info_json_file) . " > description!\n";
    die(1);
}

$keywords = $info_json->keywords ?? null;
if (empty($keywords)) {
    echo "Keywords not available in " . basename($info_json_file) . " > keywords!\n";
    die(1);
}

$homepage = $info_json->homepage ?? null;
if (empty($homepage)) {
    echo "Homepage not available in " . basename($info_json_file) . " > homepage!\n";
    die(1);
}

if ($create_tag) {
    if (file_exists($changelog_file = $build_dir . "/CHANGELOG.md")) {
        $changelog_md = file_get_contents($changelog_file);
        $changelog_header = "## [" . $version . "]";
        $changelog_header_pos = strpos($changelog_md, $changelog_header);
        if ($changelog_header_pos !== false) {
            $changelog = substr($changelog_md, $changelog_header_pos + strlen($changelog_header));
            $changelog_end_pos = strpos($changelog, "\n\n");
            if ($changelog_end_pos !== false) {
                $changelog = substr($changelog, 0, $changelog_end_pos);
            }
            $changelog = trim($changelog);
        } else {
            $create_tag = false;
        }
    } else {
        $create_tag = false;
    }
}

$members = gitlabRequest("members", 200);
if (empty($members) || empty($members = json_decode($members, true)) || !is_array($members)) {
    echo "No project members found!\n";
    die(1);
}

$maintainer_user_id = array_filter($members, fn(array $member) : bool => $member["access_level"] === 40);
if (empty($maintainer_user_id)) {
    echo "No project maintainer found!\n";
    die(1);
}
$maintainer_user_id = current($maintainer_user_id)["id"];

$github_url = gitlabRequest("remote_mirrors", 200);
if (!empty($github_url) && !empty($github_url = json_decode($github_url, true)) && is_array($github_url)
    && !empty($github_url = current($github_url)["url"])
) {
    $github_url = explode("@", $github_url)[1];
    if (!str_starts_with($github_url, "github.com/")) {
        echo "Project remote mirror is not github!\n";
        die(1);
    }
    $github_url = "https://" . str_replace([".git", "github.com"], ["", "api.github.com/repos"], $github_url);
    $github_token = getEnvironmentVariable("FLUX_PUBLISH_UTILS_TOKEN_GITHUB");
} else {
    echo "No project remote mirror found!\n";
    $github_url = null;
    $github_token = null;
}

$project_infos = gitlabRequest("", 200);
if (empty($project_infos) || empty($project_infos = json_decode($project_infos, true)) || !is_array($project_infos)) {
    echo "No project infos found!\n";
    die(1);
}
$default_branch = $project_infos["default_branch"];

$branches = gitlabRequest("repository/branches", 200);
if (empty($branches) || empty($branches = json_decode($branches, true)) || !is_array($branches)) {
    echo "No project branches found!\n";
    die(1);
}

$develop_branch = current(array_filter($branches, fn(array $branch) : bool => $branch["name"] === "develop")) ?: null;

if ($develop_branch !== null) {
    echo "> Ensure \"Enable 'Delete source branch' option by default\" is disabled\n";
    gitlabRequest("", 200, "PUT", [
        "remove_source_branch_after_merge" => false
    ]);

    echo "> Auto recreate gitlab pull request `" . $develop_branch["name"] . "` to `" . $default_branch . "`\n";
    gitlabRequest("merge_requests?source_branch=" . rawurlencode($develop_branch["name"]) . "&target_branch=" . rawurlencode($default_branch) . "&title=" . rawurlencode("WIP: "
            . ucfirst($develop_branch["name"])) . "&assignee_id="
        . rawurlencode($maintainer_user_id), 201, "POST");
}

if ($create_tag) {
    $COMMIT_ID = getEnvironmentVariable("CI_COMMIT_SHA");

    echo "> Auto create version tag\n";
    gitlabRequest("repository/tags?tag_name=" . rawurlencode("v" . $version) . "&ref=" . rawurlencode($COMMIT_ID) . "&message=" . rawurlencode($changelog), 201, "POST");
    gitlabRequest("releases?tag_name=" . rawurlencode("v" . $version) . "&description=" . rawurlencode($changelog), 201, "POST");
}

echo "> Auto update gitlab and github project description\n";
gitlabRequest("", 200, "PUT", [
    "description" => $description,
    "tag_list"    => $keywords
]);
githubRequest("", 200, "PATCH", [
    "description" => $description,
    "homepage"    => $homepage
]);
githubRequest("topics", 200, "PUT", [
    "names" => $keywords
]);
