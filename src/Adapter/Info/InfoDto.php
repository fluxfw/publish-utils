<?php

namespace FluxPublishUtils\Adapter\Info;

use JsonSerializable;

class InfoDto implements JsonSerializable
{

    /**
     * @param string[]|null $topics
     * @param callable|null $check_github_tag
     */
    private function __construct(
        public readonly ?int $gitlab_project_id,
        public readonly ?string $gitlab_url,
        public readonly ?string $gitlab_token,
        public readonly bool $gitlab_trust_self_signed_certificate,
        public readonly ?string $github_repository,
        public readonly ?string $github_token,
        public readonly ?string $version,
        public readonly ?string $description,
        public readonly ?array $topics,
        public readonly ?string $homepage,
        public readonly ?string $changelog,
        public readonly ?int $gitlab_maintainer_user_id,
        public readonly ?string $default_branch,
        public readonly ?string $gitlab_develop_branch,
        public readonly ?string $commit_id,
        public readonly ?string $tag_name,
        public readonly ?string $release_title,
        public readonly mixed $check_github_tag,
        public readonly bool $pre_release,
        public readonly bool $single_branch_mode
    ) {

    }


    /**
     * @param string[]|null $topics
     */
    public static function new(
        ?int $gitlab_project_id,
        ?string $gitlab_url,
        ?string $gitlab_token,
        bool $gitlab_trust_self_signed_certificate,
        ?string $github_repository,
        ?string $github_token,
        ?string $version,
        ?string $description,
        ?array $topics,
        ?string $homepage,
        ?string $changelog,
        ?int $gitlab_maintainer_user_id,
        ?string $default_branch,
        ?string $gitlab_develop_branch,
        ?string $commit_id,
        ?string $tag_name,
        ?string $release_title,
        ?callable $check_github_tag,
        bool $pre_release,
        bool $single_branch_mode
    ) : static {
        return new static(
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
            $check_github_tag,
            $pre_release,
            $single_branch_mode
        );
    }


    public function jsonSerialize() : array
    {
        $data = get_object_vars($this);

        if (!empty($data["gitlab_token"])) {
            $data["gitlab_token"] = "***";
        }
        if (!empty($data["github_token"])) {
            $data["github_token"] = "***";
        }

        unset($data["check_github_tag"]);

        return $data;
    }
}
