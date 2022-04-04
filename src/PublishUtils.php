<?php

namespace FluxPublishUtils;

use CurlHandle;
use Exception;
use FluxPublishUtils\Libs\FluxRestBaseApi\Body\DefaultBodyType;
use FluxPublishUtils\Libs\FluxRestBaseApi\Header\DefaultHeader;
use FluxPublishUtils\Libs\FluxRestBaseApi\Method\DefaultMethod;
use FluxPublishUtils\Libs\FluxRestBaseApi\Method\Method;
use FluxPublishUtils\Libs\FluxRestBaseApi\Status\CustomStatus;
use FluxPublishUtils\Libs\FluxRestBaseApi\Status\DefaultStatus;
use FluxPublishUtils\Libs\FluxRestBaseApi\Status\Status;

class PublishUtils
{

    private function __construct()
    {

    }


    public static function new() : static
    {
        return new static();
    }


    public function run() : void
    {
        echo "> Collect infos\n";
        $info = $this->collectInfo();
        echo json_encode($info, JSON_UNESCAPED_SLASHES) . "\n";

        if (!empty($info->gitlab_url) && !empty($info->gitlab_token)) {
            if (!empty($info->default_branch) && !empty($info->gitlab_develop_branch) && !empty($info->gitlab_maintainer_user_id)) {
                echo "> Ensure \"Enable 'Delete source branch' option by default\" is disabled\n";
                $this->gitlabRequest(
                    $info->gitlab_url,
                    $info->gitlab_token,
                    $info->gitlab_trust_self_signed_certificate,
                    "",
                    DefaultStatus::_200,
                    DefaultMethod::PUT,
                    [
                        "remove_source_branch_after_merge" => false
                    ]
                );

                echo "> Create gitlab pull request `" . $info->gitlab_develop_branch . "` to `" . $info->default_branch . "` and assign it to user `" . $info->gitlab_maintainer_user_id . "`\n";
                $this->gitlabRequest(
                    $info->gitlab_url,
                    $info->gitlab_token,
                    $info->gitlab_trust_self_signed_certificate,
                    "merge_requests?source_branch=" . rawurlencode($info->gitlab_develop_branch) . "&target_branch=" . rawurlencode($info->default_branch) . "&title=" . rawurlencode("Draft: "
                        . ucfirst($info->gitlab_develop_branch)) . "&assignee_id=" . rawurlencode($info->gitlab_maintainer_user_id),
                    DefaultStatus::_201,
                    DefaultMethod::POST
                );
            }

            if (!empty($info->tag_name) && !empty($info->changelog) && !empty($info->commit_id)) {
                echo "> Create gitlab tag `" . $info->tag_name . "`\n";
                $this->gitlabRequest(
                    $info->gitlab_url,
                    $info->gitlab_token,
                    $info->gitlab_trust_self_signed_certificate,
                    "repository/tags?tag_name=" . rawurlencode($info->tag_name) . "&ref=" . rawurlencode($info->commit_id) . "&message=" . rawurlencode($info->changelog),
                    DefaultStatus::_201,
                    DefaultMethod::POST
                );

                echo "> Create gitlab release `" . $info->tag_name . "`\n";
                $this->gitlabRequest(
                    $info->gitlab_url,
                    $info->gitlab_token,
                    $info->gitlab_trust_self_signed_certificate,
                    "releases?tag_name=" . rawurlencode($info->tag_name) . (!empty($info->release_title) ? "&name=" . rawurlencode($info->release_title) : "") . "&description="
                    . rawurlencode($info->changelog),
                    DefaultStatus::_201,
                    DefaultMethod::POST
                );

                if (!empty($info->github_url) && !empty($info->github_token) && $info->check_github_tag !== null) {
                    echo "> Check github tag `" . $info->tag_name . "` exists\n";
                    while (!($info->check_github_tag)()) {
                        echo "Missing github tag " . $info->tag_name . " - Waiting 30 seconds for check again (Mirroring is may delayed)\n";
                        sleep(30);
                    }

                    echo "> Create github release `" . $info->tag_name . "`\n";
                    $this->githubRequest(
                        $info->github_url,
                        $info->github_token,
                        "releases",
                        DefaultStatus::_201,
                        DefaultMethod::POST,
                        [
                            "tag_name" => $info->tag_name,
                            ...(!empty($info->release_title) ? [
                                "name" => $info->release_title
                            ] : []),
                            "body"     => $info->changelog
                        ]
                    );
                }
            }

            if (!empty($info->description || !empty($info->topics) || !empty($info->homepage))) {
                echo "> Update project description and topics on gitlab\n";
                $this->gitlabRequest(
                    $info->gitlab_url,
                    $info->gitlab_token,
                    $info->gitlab_trust_self_signed_certificate,
                    "",
                    DefaultStatus::_200,
                    DefaultMethod::PUT,
                    [
                        "description" => $info->description,
                        "topics"      => $info->topics
                    ]
                );

                if (!empty($info->github_url) && !empty($info->github_token)) {
                    echo "> Update project description, topics and homepage on github\n";
                    $this->githubRequest(
                        $info->github_url,
                        $info->github_token,
                        "",
                        DefaultStatus::_200,
                        DefaultMethod::PATCH,
                        [
                            "description" => $info->description,
                            "homepage"    => $info->homepage
                        ]
                    );
                    $this->githubRequest(
                        $info->github_url,
                        $info->github_token,
                        "topics",
                        DefaultStatus::_200,
                        DefaultMethod::PUT,
                        [
                            "names" => $info->topics
                        ]
                    );
                }
            }
        }
    }


    private function collectInfo() : InfoDto
    {
        $gitlab_api_url = $_ENV["CI_API_V4_URL"] ?? null;

        $gitlab_project_id = $_ENV["CI_PROJECT_ID"] ?? null;

        if (!empty($gitlab_api_url) && !empty($gitlab_project_id)) {
            $gitlab_url = $gitlab_api_url . "/projects/" . $gitlab_project_id;
        } else {
            $gitlab_url = null;
        }

        $gitlab_token = $_ENV["FLUX_PUBLISH_UTILS_TOKEN"] ?? null;

        $gitlab_trust_self_signed_certificate = ($gitlab_trust_self_signed_certificate = $_ENV["FLUX_PUBLISH_UTILS_TRUST_SELF_SIGNED_CERTIFICATE"] ?? null) !== null
            && in_array($gitlab_trust_self_signed_certificate, ["true", "1"]);

        $github_url = $this->gitlabRequest(
            $gitlab_url,
            $gitlab_token,
            $gitlab_trust_self_signed_certificate,
            "remote_mirrors"
        );
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
        $tag_name = null;
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
            if ($version !== null) {
                $tag_name = "v" . $version;
            }
        }

        $changelog = null;
        $release_title = null;
        if (!empty($build_dir) && !empty($version)) {
            if (file_exists($changelog_file = $build_dir . "/CHANGELOG.md")) {
                $changelog_md = file_get_contents($changelog_file);
                $changelog_header = [];
                preg_match("/##.*(" . preg_quote($version) . ").*\n/", $changelog_md, $changelog_header, PREG_OFFSET_CAPTURE);
                if (!empty($changelog_header)) {
                    $changelog = ltrim(substr($changelog_md, $changelog_header[0][1] + strlen($changelog_header[0][0])));
                    $changelog_end_pos = strpos($changelog, "\n\n");
                    if ($changelog_end_pos !== false) {
                        $changelog = substr($changelog, 0, $changelog_end_pos);
                    }
                    $changelog = trim($changelog);
                    $release_title = substr($changelog_md, $changelog_header[1][1] + strlen($changelog_header[1][0]));
                    $release_title = trim(substr($release_title, 0, strpos($release_title, "\n")));
                    $release_title = trim(ltrim($release_title, ")]}:-/\\ "));
                }
            }
        }

        $members = $this->gitlabRequest(
            $gitlab_url,
            $gitlab_token,
            $gitlab_trust_self_signed_certificate,
            "members"
        );
        if (empty($members) || empty($members = json_decode($members, true)) || !is_array($members)) {
            $members = null;
        }

        $gitlab_maintainer_user_id = null;
        if (!empty($members)) {
            $gitlab_maintainer_user_id = array_filter($members, fn(array $member) : bool => $member["access_level"] === 50);
            if (empty($gitlab_maintainer_user_id)) {
                $gitlab_maintainer_user_id = array_filter($members, fn(array $member) : bool => $member["access_level"] === 40);
            }
            if (!empty($gitlab_maintainer_user_id)) {
                $gitlab_maintainer_user_id = current($gitlab_maintainer_user_id)["id"];
            } else {
                $gitlab_maintainer_user_id = null;
            }
        }

        $default_branch = $_ENV["CI_DEFAULT_BRANCH"] ?? null;

        $branches = $this->gitlabRequest(
            $gitlab_url,
            $gitlab_token,
            $gitlab_trust_self_signed_certificate,
            "repository/branches"
        );
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
            $commit_id,
            $tag_name,
            $release_title,
            $github_url !== null && $github_token !== null && $tag_name !== null ? function () use ($github_url, $github_token, $tag_name) : bool {
                $tags = $this->githubRequest(
                    $github_url,
                    $github_token,
                    "tags"
                );
                if (empty($tags) || empty($tags = json_decode($tags, true)) || !is_array($tags)) {
                    return false;
                }

                return !empty(array_filter($tags, fn(array $tag) : bool => $tag["name"] === $tag_name));
            } : null
        );
    }


    private function githubRequest(?string $github_url, ?string $github_token, string $api_url, ?Status $expect_status = null, ?Method $method = null, ?array $body_data = null) : ?string
    {
        if (empty($github_url) || empty($github_token)) {
            return null;
        }

        $request_url = $github_url . (!empty($api_url) ? "/" . $api_url : "");

        return $this->request(
            $request_url,
            function (CurlHandle $curl, array &$headers) use ($github_token) : void {
                curl_setopt($curl, CURLOPT_USERPWD, $github_token);
                $headers[DefaultHeader::ACCEPT->value] = "application/vnd.github.mercy-preview+json";
            },
            $expect_status,
            $method,
            $body_data
        );
    }


    private function gitlabRequest(
        ?string $gitlab_url,
        ?string $gitlab_token,
        bool $gitlab_trust_self_signed_certificate,
        string $api_url,
        ?Status $expect_status = null,
        ?Method $method = null,
        ?array $body_data = null
    ) : ?string {
        if (empty($gitlab_url) || empty($gitlab_token)) {
            return null;
        }

        $request_url = $gitlab_url . (!empty($api_url) ? "/" . $api_url : "");

        return $this->request(
            $request_url,
            function (CurlHandle $curl, array &$headers) use ($gitlab_token) : void {
                $headers["PRIVATE-TOKEN"] = $gitlab_token;
            },
            $expect_status,
            $method,
            $body_data,
            $gitlab_trust_self_signed_certificate
        );
    }


    private function request(
        string $request_url,
        callable $set_token,
        ?Status $expect_status = null,
        ?Method $method = null,
        ?array $body_data = null,
        bool $trust_self_signed_certificate = false
    ) : ?string {
        $expect_status = $expect_status ?? DefaultStatus::_200;
        $method = $method ?? DefaultMethod::GET;

        $curl = null;
        $response = null;
        $status = null;

        try {
            $curl = curl_init($request_url);

            $headers = [
                DefaultHeader::USER_AGENT->value => __NAMESPACE__
            ];

            $set_token($curl, $headers);

            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method->value);

            if (!empty($body_data)) {
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($body_data, JSON_UNESCAPED_SLASHES));
                $headers[DefaultHeader::CONTENT_TYPE->value] = DefaultBodyType::JSON->value;
            }

            curl_setopt($curl, CURLOPT_HTTPHEADER, array_map(fn(string $key, string $value) : string => $key . ": " . $value, array_keys($headers), $headers));

            curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

            if ($trust_self_signed_certificate) {
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($curl, CURLOPT_PROXY_SSL_VERIFYHOST, false);
            }

            $response = curl_exec($curl);

            if (curl_errno($curl) !== 0) {
                throw new Exception(curl_error($curl));
            }

            $status = CustomStatus::factory(curl_getinfo($curl, CURLINFO_HTTP_CODE));
        } finally {
            if ($curl !== null) {
                curl_close($curl);
            }
        }

        if ($status !== $expect_status) {
            echo "curl " . $method->value . " request: " . $request_url . "\n";
            echo "Body data: " . json_encode($body_data, JSON_UNESCAPED_SLASHES) . "\n";
            //echo "Headers: " . json_encode($headers, JSON_UNESCAPED_SLASHES) . "\n";
            echo "Response: " . $response . "\n";
            echo "Response status code: " . $status->value . "\n";
            echo "Expect status code: " . $expect_status->value . "\n";
            die(1);
        }

        return $response;
    }
}