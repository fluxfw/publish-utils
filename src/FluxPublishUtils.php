<?php

namespace FluxPublishUtils;

use CurlHandle;
use FluxRestBaseApi\Body\BodyType;
use FluxRestBaseApi\Header\Header;
use FluxRestBaseApi\Method\Method;
use FluxRestBaseApi\Status\Status;

class FluxPublishUtils
{

    public static function new() : static
    {
        $command = new static();

        return $command;
    }


    public function run() : void
    {
        echo "> Collect infos\n";
        $infos = $this->collectInfos();
        echo json_encode($infos, JSON_UNESCAPED_SLASHES) . "\n";

        if (!empty($infos->getDefaultBranch()) && !empty($infos->getDevelopBranch()) && !empty($infos->getMaintainerUserId())) {
            echo "> Ensure \"Enable 'Delete source branch' option by default\" is disabled\n";
            $this->gitlabRequest($infos->getUrl(), $infos->getToken(), $infos->isTrustSelfSignedCertificate(), "", Status::_200, Method::PUT, [
                "remove_source_branch_after_merge" => false
            ]);

            echo "> Create gitlab pull request `" . $infos->getDevelopBranch() . "` to `" . $infos->getDefaultBranch() . "` and assign it to user `" . $infos->getMaintainerUserId() . "`\n";
            $this->gitlabRequest($infos->getUrl(), $infos->getToken(), $infos->isTrustSelfSignedCertificate(),
                "merge_requests?source_branch=" . rawurlencode($infos->getDevelopBranch()) . "&target_branch=" . rawurlencode($infos->getDefaultBranch()) . "&title="
                . rawurlencode("WIP: " . ucfirst($infos->getDevelopBranch())) . "&assignee_id=" . rawurlencode($infos->getMaintainerUserId()), Status::_201, Method::POST);
        }

        if (!empty($infos->getVersion()) && !empty($infos->getChangelog()) && !empty($infos->getCommitId())) {
            echo "> Create gitlab version tag\n";
            $this->gitlabRequest($infos->getUrl(), $infos->getToken(), $infos->isTrustSelfSignedCertificate(),
                "repository/tags?tag_name=" . rawurlencode("v" . $infos->getVersion()) . "&ref=" . rawurlencode($infos->getCommitId()) . "&message="
                . rawurlencode($infos->getChangelog()),
                Status::_201, Method::POST);

            echo "> Create gitlab version release\n";
            $this->gitlabRequest($infos->getUrl(), $infos->getToken(), $infos->isTrustSelfSignedCertificate(),
                "releases?tag_name=" . rawurlencode("v" . $infos->getVersion()) . "&description=" . rawurlencode($infos->getChangelog()), Status::_201, Method::POST);
        }

        if (!empty($infos->getDescription() || !empty($infos->getTopics()) || !empty($infos->getHomepage()))) {
            echo "> Update project description and topics on gitlab\n";
            $this->gitlabRequest($infos->getUrl(), $infos->getToken(), $infos->isTrustSelfSignedCertificate(), "", Status::_200, Method::PUT, [
                "description" => $infos->getDescription() ?? "",
                "topics"      => $infos->getTopics() ?? []
            ]);

            if (!empty($infos->getGithubUrl()) && !empty($infos->getGithubToken())) {
                echo "> Update project description, topics and homepage on github\n";
                $this->githubRequest($infos->getGithubUrl(), $infos->getGithubToken(), "", Status::_200, Method::PATCH, [
                    "description" => $infos->getDescription() ?? "",
                    "homepage"    => $infos->getHomepage() ?? ""
                ]);
                $this->githubRequest($infos->getGithubUrl(), $infos->getGithubToken(), "topics", Status::_200, Method::PUT, [
                    "names" => $infos->getTopics() ?? []
                ]);
            }
        }
    }


    private function collectInfos() : InfoDto
    {
        $server_url = $_ENV["CI_SERVER_URL"] ?? null;

        $project_id = $_ENV["CI_PROJECT_ID"] ?? null;

        if (!empty($server_url) && !empty($project_id)) {
            $url = $server_url . "/api/v4/projects/" . $project_id;
        } else {
            $url = null;
        }

        $token = $_ENV["FLUX_PUBLISH_UTILS_TOKEN"] ?? null;

        $trust_self_signed_certificate = ($trust_self_signed_certificate = $_ENV["FLUX_PUBLISH_UTILS_TRUST_SELF_SIGNED_CERTIFICATE"] ?? null) !== null
            && in_array($trust_self_signed_certificate, ["true", "1"]);

        $github_url = $this->gitlabRequest($url, $token, $trust_self_signed_certificate, "remote_mirrors", Status::_200);
        if (!empty($github_url) && !empty($github_url = json_decode($github_url, true)) && is_array($github_url) && !empty($github_url = current($github_url)["url"])
        ) {
            $github_url = explode("@", $github_url)[1];
            if (str_starts_with($github_url, "github.com/")) {
                $github_url = "https://" . str_replace([".git", "github.com"], ["", "api.github.com/repos"], $github_url);
            } else {
                $github_url = null;
            }
        } else {
            $github_url = null;
        }

        $github_token = $_ENV["FLUX_PUBLISH_UTILS_TOKEN_GITHUB"] ?? null;

        $build_dir = $_ENV["CI_PROJECT_DIR"] ?? null;

        $version = null;
        $description = null;
        $topics = null;
        $homepage = null;
        if (!empty($build_dir)) {
            if (file_exists($info_json_file = $build_dir . "/metadata.json")) {
                $info_json = json_decode(file_get_contents($info_json_file));

                $version = $info_json->version ?? null;
                $description = $info_json->description ?? null;
                $topics = $info_json->keywords ?? null;
                $homepage = $info_json->homepage ?? null;
            } else {
                if (file_exists($info_json_file = $build_dir . "/composer.json")) {
                    $info_json = json_decode(file_get_contents($info_json_file));

                    $version = $info_json->version ?? null;
                    $description = $info_json->description ?? null;
                    $topics = $info_json->keywords ?? null;
                    $homepage = $info_json->homepage ?? null;
                } else {
                    if (file_exists($info_json_file = $build_dir . "/package.json")) {
                        $info_json = json_decode(file_get_contents($info_json_file));

                        $version = $info_json->version ?? null;
                        $description = $info_json->description ?? null;
                        $topics = $info_json->keywords ?? null;
                        $homepage = $info_json->homepage ?? null;
                    }
                }
            }
        }

        $changelog = null;
        if (!empty($build_dir) && !empty($version)) {
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
                }
            }
        }

        $members = $this->gitlabRequest($url, $token, $trust_self_signed_certificate, "members", Status::_200);
        if (empty($members) || empty($members = json_decode($members, true)) || !is_array($members)) {
            $members = null;
        }

        $maintainer_user_id = null;
        if (!empty($members)) {
            $maintainer_user_id = array_filter($members, fn(array $member) : bool => $member["access_level"] === 40);
            if (!empty($maintainer_user_id)) {
                $maintainer_user_id = current($maintainer_user_id)["id"];
            } else {
                $maintainer_user_id = null;
            }
        }

        $project_infos = $this->gitlabRequest($url, $token, $trust_self_signed_certificate, "", Status::_200);
        if (empty($project_infos) || empty($project_infos = json_decode($project_infos, true)) || !is_array($project_infos)) {
            $project_infos = null;
        }

        if (!empty($project_infos)) {
            $default_branch = $project_infos["default_branch"];
        } else {
            $default_branch = null;
        }

        $branches = $this->gitlabRequest($url, $token, $trust_self_signed_certificate, "repository/branches", Status::_200);
        if (empty($branches) || empty($branches = json_decode($branches, true)) || !is_array($branches)) {
            $branches = null;
        }

        $develop_branch = null;
        if (!empty($branches)) {
            $develop_branch = current(array_filter($branches, fn(array $branch) : bool => $branch["name"] === "develop")) ?: null;
            if (!empty($develop_branch)) {
                $develop_branch = $develop_branch["name"] ?? null;
            } else {
                $develop_branch = null;
            }
        }

        $commit_id = $_ENV["CI_COMMIT_SHA"] ?? null;

        return InfoDto::new(
            $url,
            $token,
            $trust_self_signed_certificate,
            $github_url,
            $github_token,
            $version,
            $description,
            $topics,
            $homepage,
            $changelog,
            $maintainer_user_id,
            $default_branch,
            $develop_branch,
            $commit_id
        );
    }


    private function githubRequest(string $github_url, string $github_token, string $api_url, int $expect_status_code, string $method = Method::GET, ?array $body_data = null) : ?string
    {
        $request_url = $github_url . (!empty($api_url) ? "/" . $api_url : "");

        return $this->request($request_url, function (CurlHandle $curl, array &$headers) use ($github_token) : void {
            curl_setopt($curl, CURLOPT_USERPWD, $github_token);
            $headers[Header::ACCEPT] = "application/vnd.github.mercy-preview+json";
        }, $expect_status_code, $method, $body_data);
    }


    private function gitlabRequest(
        ?string $url,
        ?string $token,
        bool $trust_self_signed_certificate,
        string $api_url,
        int $expect_status_code,
        string $method = Method::GET,
        ?array $body_data = null
    ) : ?string {
        if (empty($url) || empty($token)) {
            return null;
        }

        $request_url = $url . (!empty($api_url) ? "/" . $api_url : "");

        return $this->request($request_url, function (CurlHandle $curl, array &$headers) use ($token) : void {
            $headers["PRIVATE-TOKEN"] = $token;
        }, $expect_status_code, $method, $body_data, $trust_self_signed_certificate);
    }


    private function request(
        string $request_url,
        callable $set_token,
        int $expect_status_code,
        string $method = Method::GET,
        ?array $body_data = null,
        bool $trust_self_signed_certificate = false
    ) : ?string {
        $curl = null;
        $response = null;
        $status_code = null;
        try {
            $curl = curl_init($request_url);

            $headers = [
                Header::USER_AGENT => __NAMESPACE__
            ];

            $set_token($curl, $headers);

            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);

            if (!empty($body_data)) {
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($body_data, JSON_UNESCAPED_SLASHES));
                $headers[Header::CONTENT_TYPE] = BodyType::JSON;
            }

            curl_setopt($curl, CURLOPT_HTTPHEADER, array_map(fn(string $key, string $value) : string => $key . ": " . $value, array_keys($headers), $headers));

            curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

            if ($trust_self_signed_certificate) {
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($curl, CURLOPT_PROXY_SSL_VERIFYHOST, false);
            }

            $response = curl_exec($curl);

            $status_code = intval(curl_getinfo($curl, CURLINFO_HTTP_CODE));
        } finally {
            if ($curl !== null) {
                curl_close($curl);
            }
        }

        if ($status_code !== $expect_status_code) {
            echo "curl " . $method . " request: " . $request_url . "\n";
            //echo "Body data: " . json_encode($body_data, JSON_UNESCAPED_SLASHES) . "\n";
            //echo "Headers: " . json_encode($headers, JSON_UNESCAPED_SLASHES) . "\n";
            //echo "Response: " . $response . "\n";
            echo "Response status code: " . $status_code . "\n";
            echo "Expect status code: " . $expect_status_code . "\n";
            die(1);
        }

        return $response;
    }
}
