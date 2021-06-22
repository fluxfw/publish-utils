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
        curl_setopt($curl, CURLOPT_HTTPHEADER, array_map(function (string $key, string $value) : string {
            return ($key . ": " . $value);
        }, array_keys($headers), $headers));

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

    return request($request_url, function ($curl, array &$headers) use ($FLUX_PUBLISH_UTILS_TOKEN) : void {
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

    return request($request_url, function ($curl, array &$headers) use ($github_token) : void {
        curl_setopt($curl, CURLOPT_USERPWD, $github_token);
        $headers["Accept"] = "application/vnd.github.mercy-preview+json";
    }, $expect_status_code, $method, $body_data);
}

if (php_sapi_name() !== "cli") {
    die();
}

echo "> Collect needed infos\n";

if (!file_exists($info_json_file = getcwd() . "/composer.json")) {
    if (!file_exists($info_json_file = getcwd() . "/package.json")) {
        if (!file_exists($info_json_file = getcwd() . "/metadata.json")) {
            echo "Neither composer.json or package.json or metadata.json found!\n";
            die(1);
        }
    }
}

$info_json = json_decode(file_get_contents($info_json_file));

$create_tag = true;

$version = $info_json->version;
if (empty($version)) {
    $create_tag = false;
}

$description = $info_json->description;
if (empty($description)) {
    echo "Short description not available in " . basename($info_json_file) . " > description!\n";
    die(1);
}

$keywords = $info_json->keywords;
if (empty($keywords)) {
    echo "Keywords not available in " . basename($info_json_file) . " > keywords!\n";
    die(1);
}

$homepage = $info_json->homepage;
if (empty($homepage)) {
    echo "Homepage not available in " . basename($info_json_file) . " > homepage!\n";
    die(1);
}

if ($create_tag) {
    if (file_exists($changelog_file = getcwd() . "/CHANGELOG.md")) {
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

$maintainer_user_id = gitlabRequest("members", 200);
if (empty($maintainer_user_id) || empty($maintainer_user_id = json_decode($maintainer_user_id, true)) || !is_array($maintainer_user_id)) {
    echo "No project members found!\n";
    die(1);
}
$maintainer_user_id = array_filter($maintainer_user_id, function (array $member) : bool {
    return ($member["access_level"] === 40);
});
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
    if (strpos($github_url, "github.com/") !== 0) {
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

if ($create_tag) {
    $COMMIT_ID = getEnvironmentVariable("CI_COMMIT_SHA");

    echo "> Auto create version tag\n";
    gitlabRequest("repository/tags?tag_name=" . rawurlencode("v" . $version) . "&ref=" . rawurlencode($COMMIT_ID) . "&message=" . rawurlencode($changelog) . "&release_description="
        . rawurlencode($changelog), 201, "POST");
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

echo "> Ensure \"Enable 'Delete source branch' option by default\" is disabled\n";
gitlabRequest("", 200, "PUT", [
    "remove_source_branch_after_merge" => false
]);

echo "> Auto recreate gitlab pull request `develop` to `main`\n";
gitlabRequest("merge_requests?source_branch=" . rawurlencode("develop") . "&target_branch=" . rawurlencode("main") . "&title=" . rawurlencode("WIP: Develop") . "&assignee_id="
    . rawurlencode($maintainer_user_id), 201, "POST");
