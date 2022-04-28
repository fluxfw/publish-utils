<?php

namespace FluxPublishUtils\Channel\Info\Command;

use FluxPublishUtils\Adapter\Info\InfoDto;
use FluxPublishUtils\Channel\Github\Port\GithubService;
use FluxPublishUtils\Channel\Gitlab\Port\GitlabService;

class CollectInfoCommand
{

    private function __construct(
        private readonly GitlabService $gitlab_service,
        private readonly GithubService $github_service
    ) {

    }


    public static function new(
        GitlabService $gitlab_service,
        GithubService $github_service
    ) : static {
        return new static(
            $gitlab_service,
            $github_service
        );
    }


    public function collectInfo() : InfoDto
    {
        global $argv;

        $gitlab_project_id = $_ENV["CI_PROJECT_ID"] ?? null;
        $gitlab_url = $_ENV["CI_SERVER_URL"] ?? null;
        $gitlab_token = $_ENV["FLUX_PUBLISH_UTILS_TOKEN"] ?? null;
        $gitlab_trust_self_signed_certificate = ($gitlab_trust_self_signed_certificate = $_ENV["FLUX_PUBLISH_UTILS_TRUST_SELF_SIGNED_CERTIFICATE"] ?? null) !== null
            && in_array($gitlab_trust_self_signed_certificate, ["true", "1"]);

        $github_repository = $this->gitlab_service->getGitlabRepositoryRemoteMirrors(
            $gitlab_project_id,
            $gitlab_url,
            $gitlab_token,
            $gitlab_trust_self_signed_certificate
        );
        if (!empty($github_repository) && !empty($github_repository = current($github_repository)["url"])) {
            $github_repository = explode("@", $github_repository)[1] ?? null;
            if (str_starts_with($github_repository, "github.com/")) {
                $github_repository = trim(str_replace([".git", "github.com"], "", $github_repository), "/");
            } else {
                $github_repository = null;
            }
        } else {
            $github_repository = null;
        }
        $github_token = $_ENV["FLUX_PUBLISH_UTILS_TOKEN_GITHUB"] ?? null;

        $build_dir = $_ENV["CI_PROJECT_DIR"] ?? null;

        $version = null;
        $description = null;
        $topics = null;
        $homepage = null;
        $tag_name = null;
        $pre_release = false;
        $release_asset_path = null;
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
            if (!empty($version)) {
                $tag_name = "v" . $version;
                $pre_release = str_contains($version, "pre") || str_contains($version, "rc") || str_contains($version, "alpha") || str_contains($version, "beta");
            }
            $release_asset_path = $argv[1] ?? null;
            if (!empty($release_asset_path)) {
                $release_asset_path = $build_dir . "/" . $release_asset_path;
            }
        }

        $changelog = null;
        $release_title = null;
        if (!empty($build_dir) && !empty($version)) {
            if (file_exists($changelog_file = $build_dir . "/CHANGELOG.md")) {
                $changelog_md = file_get_contents($changelog_file);
                $changelog_header = [];
                preg_match("/(\n|^)##(.*" . preg_quote($version) . ".*)(\n)/", $changelog_md, $changelog_header, PREG_OFFSET_CAPTURE);
                if (!empty($changelog_header)) {
                    $changelog = substr($changelog_md, $changelog_header[3][1] + strlen($changelog_header[3][0]));
                    if (($changelog_end_pos = strpos($changelog, "\n\n")) !== false) {
                        $changelog = substr($changelog, 0, $changelog_end_pos);
                    }
                    $changelog = trim($changelog);
                    $release_title = trim(substr($changelog_md, $changelog_header[2][1], strlen($changelog_header[2][0])));
                }
            }
        }

        $members = $this->gitlab_service->getGitlabRepositoryMembers(
            $gitlab_project_id,
            $gitlab_url,
            $gitlab_token,
            $gitlab_trust_self_signed_certificate
        );
        if (empty($members)) {
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

        $branches = $this->gitlab_service->getGitlabRepositoryBranches(
            $gitlab_project_id,
            $gitlab_url,
            $gitlab_token,
            $gitlab_trust_self_signed_certificate
        );
        if (empty($branches)) {
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
            $gitlab_project_id,
            $gitlab_url,
            $gitlab_token,
            $gitlab_trust_self_signed_certificate,
            $github_repository,
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
            !empty($github_repository) && !empty($github_token) && !empty($tag_name) ? function () use ($github_repository, $github_token, $tag_name) : bool {
                $tags = $this->github_service->getGithubRepositoryTags(
                    $github_repository,
                    $github_token
                );
                if (empty($tags)) {
                    return false;
                }

                return !empty(array_filter($tags, fn(array $tag) : bool => $tag["name"] === $tag_name));
            } : null,
            $pre_release,
            empty($gitlab_develop_branch),
            $release_asset_path,
            $argv[2] ?? null
        );
    }
}
