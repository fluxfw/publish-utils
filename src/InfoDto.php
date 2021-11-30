<?php

namespace FluxPublishUtils;

use JsonSerializable;

class InfoDto implements JsonSerializable
{

    private readonly ?string $changelog;
    private readonly ?string $commit_id;
    private readonly ?string $default_branch;
    private readonly ?string $description;
    private readonly ?string $github_token;
    private readonly ?string $github_url;
    private readonly ?string $gitlab_develop_branch;
    private readonly ?int $gitlab_maintainer_user_id;
    private readonly ?string $gitlab_token;
    private readonly bool $gitlab_trust_self_signed_certificate;
    private readonly ?string $gitlab_url;
    private readonly ?string $homepage;
    private readonly ?array $topics;
    private readonly ?string $version;


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


    public function getChangelog() : ?string
    {
        return $this->changelog;
    }


    public function getCommitId() : ?string
    {
        return $this->commit_id;
    }


    public function getDefaultBranch() : ?string
    {
        return $this->default_branch;
    }


    public function getDescription() : ?string
    {
        return $this->description;
    }


    public function getGithubToken() : ?string
    {
        return $this->github_token;
    }


    public function getGithubUrl() : ?string
    {
        return $this->github_url;
    }


    public function getGitlabDevelopBranch() : ?string
    {
        return $this->gitlab_develop_branch;
    }


    public function getGitlabMaintainerUserId() : ?int
    {
        return $this->gitlab_maintainer_user_id;
    }


    public function getGitlabToken() : ?string
    {
        return $this->gitlab_token;
    }


    public function getGitlabUrl() : ?string
    {
        return $this->gitlab_url;
    }


    public function getHomepage() : ?string
    {
        return $this->homepage;
    }


    public function getTopics() : ?array
    {
        return $this->topics;
    }


    public function getVersion() : ?string
    {
        return $this->version;
    }


    public function isGitlabTrustSelfSignedCertificate() : bool
    {
        return $this->gitlab_trust_self_signed_certificate;
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
