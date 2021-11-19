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
        $info = $this->collectInfo();
        echo json_encode($info, JSON_UNESCAPED_SLASHES) . "\n";

        if (!empty($info->getGitlabUrl()) && !empty($info->getGitlabToken())) {
            if (!empty($info->getDefaultBranch()) && !empty($info->getGitlabDevelopBranch()) && !empty($info->getGitlabMaintainerUserId())) {
                echo "> Ensure \"Enable 'Delete source branch' option by default\" is disabled\n";
                $this->gitlabRequest($info->getGitlabUrl(), $info->getGitlabToken(), $info->isGitlabTrustSelfSignedCertificate(), "", Status::_200, Method::PUT, [
                    "remove_source_branch_after_merge" => false
                ]);

                echo "> Create gitlab pull request `" . $info->getGitlabDevelopBranch() . "` to `" . $info->getDefaultBranch() . "` and assign it to user `"
                    . $info->getGitlabMaintainerUserId() . "`\n";
                $this->gitlabRequest($info->getGitlabUrl(), $info->getGitlabToken(), $info->isGitlabTrustSelfSignedCertificate(),
                    "merge_requests?source_branch=" . rawurlencode($info->getGitlabDevelopBranch()) . "&target_branch=" . rawurlencode($info->getDefaultBranch()) . "&title="
                    . rawurlencode("WIP: " . ucfirst($info->getGitlabDevelopBranch())) . "&assignee_id=" . rawurlencode($info->getGitlabMaintainerUserId()), Status::_201, Method::POST);
            }

            if (!empty($info->getVersion()) && !empty($info->getChangelog()) && !empty($info->getCommitId())) {
                echo "> Create gitlab version tag `v" . $info->getVersion() . "`\n";
                $this->gitlabRequest($info->getGitlabUrl(), $info->getGitlabToken(), $info->isGitlabTrustSelfSignedCertificate(),
                    "repository/tags?tag_name=" . rawurlencode("v" . $info->getVersion()) . "&ref=" . rawurlencode($info->getCommitId()) . "&message="
                    . rawurlencode($info->getChangelog()),
                    Status::_201, Method::POST);

                echo "> Create gitlab version release `v" . $info->getVersion() . "`\n";
                $this->gitlabRequest($info->getGitlabUrl(), $info->getGitlabToken(), $info->isGitlabTrustSelfSignedCertificate(),
                    "releases?tag_name=" . rawurlencode("v" . $info->getVersion()) . "&description=" . rawurlencode($info->getChangelog()), Status::_201, Method::POST);
            }

            if (!empty($info->getDescription() || !empty($info->getTopics()) || !empty($info->getHomepage()))) {
                echo "> Update project description and topics on gitlab\n";
                $this->gitlabRequest($info->getGitlabUrl(), $info->getGitlabToken(), $info->isGitlabTrustSelfSignedCertificate(), "", Status::_200, Method::PUT, [
                    "description" => $info->getDescription() ?? "",
                    "topics"      => $info->getTopics() ?? []
                ]);

                if (!empty($info->getGithubUrl()) && !empty($info->getGithubToken())) {
                    echo "> Update project description, topics and homepage on github\n";
                    $this->githubRequest($info->getGithubUrl(), $info->getGithubToken(), "", Status::_200, Method::PATCH, [
                        "description" => $info->getDescription() ?? "",
                        "homepage"    => $info->getHomepage() ?? ""
                    ]);
                    $this->githubRequest($info->getGithubUrl(), $info->getGithubToken(), "topics", Status::_200, Method::PUT, [
                        "names" => $info->getTopics() ?? []
                    ]);
                }
            }
        }
    }


    private function collectInfo() : InfoDto
    {
        $gitlab_server_url = $_ENV["CI_SERVER_URL"] ?? null;

        $gitlab_project_id = $_ENV["CI_PROJECT_ID"] ?? null;

        if (!empty($gitlab_server_url) && !empty($gitlab_project_id)) {
            $gitlab_url = $gitlab_server_url . "/api/v4/projects/" . $gitlab_project_id;
        } else {
            $gitlab_url = null;
        }

        $gitlab_token = $_ENV["FLUX_PUBLISH_UTILS_TOKEN"] ?? null;

        $gitlab_trust_self_signed_certificate = ($gitlab_trust_self_signed_certificate = $_ENV["FLUX_PUBLISH_UTILS_TRUST_SELF_SIGNED_CERTIFICATE"] ?? null) !== null
            && in_array($gitlab_trust_self_signed_certificate, ["true", "1"]);

        $github_url = $this->gitlabRequest($gitlab_url, $gitlab_token, $gitlab_trust_self_signed_certificate, "remote_mirrors", Status::_200);
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
                $topics = $info_json->topics ?? $info_json->keywords ?? null;
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

        $members = $this->gitlabRequest($gitlab_url, $gitlab_token, $gitlab_trust_self_signed_certificate, "members", Status::_200);
        if (empty($members) || empty($members = json_decode($members, true)) || !is_array($members)) {
            $members = null;
        }

        $gitlab_maintainer_user_id = null;
        if (!empty($members)) {
            $gitlab_maintainer_user_id = array_filter($members, fn(array $member) : bool => $member["access_level"] === 40);
            if (!empty($gitlab_maintainer_user_id)) {
                $gitlab_maintainer_user_id = current($gitlab_maintainer_user_id)["id"];
            } else {
                $gitlab_maintainer_user_id = null;
            }
        }

        $project_infos = $this->gitlabRequest($gitlab_url, $gitlab_token, $gitlab_trust_self_signed_certificate, "", Status::_200);
        if (empty($project_infos) || empty($project_infos = json_decode($project_infos, true)) || !is_array($project_infos)) {
            $project_infos = null;
        }

        if (!empty($project_infos)) {
            $default_branch = $project_infos["default_branch"];
        } else {
            $default_branch = null;
        }

        $branches = $this->gitlabRequest($gitlab_url, $gitlab_token, $gitlab_trust_self_signed_certificate, "repository/branches", Status::_200);
        if (empty($branches) || empty($branches = json_decode($branches, true)) || !is_array($branches)) {
            $branches = null;
        }

        $gitlab_develop_branch = null;
        if (!empty($branches)) {
            $gitlab_develop_branch = current(array_filter($branches, fn(array $branch) : bool => $branch["name"] === "develop")) ?: null;
            if (!empty($gitlab_develop_branch)) {
                $gitlab_develop_branch = $gitlab_develop_branch["name"] ?? null;
            } else {
                $gitlab_develop_branch = null;
            }
        }

        $commit_id = $_ENV["CI_COMMIT_SHA"] ?? null;

        return InfoDto::new(
            $gitlab_url,
            $gitlab_token,
            $gitlab_trust_self_signed_certificate,
            $github_url,
            $github_token,
            $version,
            $description,
            $topics,
            $homepage,
            $changelog,
            $gitlab_maintainer_user_id,
            $default_branch,
            $gitlab_develop_branch,
            $commit_id
        );
    }


    private function githubRequest(?string $github_url, ?string $github_token, string $api_url, int $expect_status_code, string $method = Method::GET, ?array $body_data = null) : ?string
    {
        if (empty($github_url) || empty($github_token)) {
            return null;
        }

        $request_url = $github_url . (!empty($api_url) ? "/" . $api_url : "");

        return $this->request($request_url, function (CurlHandle $curl, array &$headers) use ($github_token) : void {
            curl_setopt($curl, CURLOPT_USERPWD, $github_token);
            $headers[Header::ACCEPT] = "application/vnd.github.mercy-preview+json";
        }, $expect_status_code, $method, $body_data);
    }


    private function gitlabRequest(
        ?string $gitlab_url,
        ?string $gitlab_token,
        bool $gitlab_trust_self_signed_certificate,
        string $api_url,
        int $expect_status_code,
        string $method = Method::GET,
        ?array $body_data = null
    ) : ?string {
        if (empty($gitlab_url) || empty($gitlab_token)) {
            return null;
        }

        $request_url = $gitlab_url . (!empty($api_url) ? "/" . $api_url : "");

        return $this->request($request_url, function (CurlHandle $curl, array &$headers) use ($gitlab_token) : void {
            $headers["PRIVATE-TOKEN"] = $gitlab_token;
        }, $expect_status_code, $method, $body_data, $gitlab_trust_self_signed_certificate);
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
            echo "Body data: " . json_encode($body_data, JSON_UNESCAPED_SLASHES) . "\n";
            //echo "Headers: " . json_encode($headers, JSON_UNESCAPED_SLASHES) . "\n";
            echo "Response: " . $response . "\n";
            echo "Response status code: " . $status_code . "\n";
            echo "Expect status code: " . $expect_status_code . "\n";
            die(1);
        }

        return $response;
    }
}
