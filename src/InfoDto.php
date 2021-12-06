<?php

namespace FluxPublishUtils;

use JsonSerializable;

class InfoDto implements JsonSerializable
{

    public readonly ?string $changelog;
    public readonly ?string $commit_id;
    public readonly ?string $default_branch;
    public readonly ?string $description;
    public readonly ?string $github_token;
    public readonly ?string $github_url;
    public readonly ?string $gitlab_develop_branch;
    public readonly ?int $gitlab_maintainer_user_id;
    public readonly ?string $gitlab_token;
    public readonly bool $gitlab_trust_self_signed_certificate;
    public readonly ?string $gitlab_url;
    public readonly ?string $homepage;
    public readonly ?array $topics;
    public readonly ?string $version;


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
        ?string $commit_id
    ) : static {
        $dto = new static();

        $dto->gitlab_url = $gitlab_url;
        $dto->gitlab_token = $gitlab_token;
        $dto->gitlab_trust_self_signed_certificate = $gitlab_trust_self_signed_certificate;
        $dto->github_url = $github_url;
        $dto->github_token = $github_token;
        $dto->version = $version;
        $dto->description = $description;
        $dto->topics = $topics;
        $dto->homepage = $homepage;
        $dto->changelog = $changelog;
        $dto->gitlab_maintainer_user_id = $gitlab_maintainer_user_id;
        $dto->default_branch = $default_branch;
        $dto->gitlab_develop_branch = $gitlab_develop_branch;
        $dto->commit_id = $commit_id;

        return $dto;
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
