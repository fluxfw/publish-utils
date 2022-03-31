<?php

namespace FluxPublishUtils;

use JsonSerializable;

class InfoDto implements JsonSerializable
{

    private function __construct(
        public readonly ?string $gitlab_url,
        public readonly ?string $gitlab_token,
        public readonly bool $gitlab_trust_self_signed_certificate,
        public readonly ?string $github_url,
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
        public readonly ?string $tag_name
    ) {

    }


    public static function new(
        ?string $gitlab_url,
        ?string $gitlab_token,
        bool $gitlab_trust_self_signed_certificate,
        ?string $github_url,
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
        ?string $tag_name
    ) : static {
        return new static(
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
            $tag_name
        );
    }


    public function jsonSerialize() : array
    {
        $json = get_object_vars($this);

        if (!empty($json["gitlab_token"])) {
            $json["gitlab_token"] = "***";
        }
        if (!empty($json["github_token"])) {
            $json["github_token"] = "***";
        }

        return $json;
    }
}
