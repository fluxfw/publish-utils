<?php

namespace FluxPublishUtils;

use JsonSerializable;

class InfoDto implements JsonSerializable
{

    private ?string $changelog;
    private ?string $commit_id;
    private ?string $default_branch;
    private ?string $description;
    private ?string $develop_branch;
    private ?string $github_token;
    private ?string $github_url;
    private ?string $homepage;
    private ?int $maintainer_user_id;
    private ?string $token;
    private ?array $topics;
    private bool $trust_self_signed_certificate;
    private ?string $url;
    private ?string $version;


    public static function new(
        ?string $url,
        ?string $token,
        bool $trust_self_signed_certificate,
        ?string $github_url,
        ?string $github_token,
        ?string $version,
        ?string $description,
        ?array $topics,
        ?string $homepage,
        ?string $changelog,
        ?int $maintainer_user_id,
        ?string $default_branch,
        ?string $develop_branch,
        ?string $commit_id
    ) : static {
        $dto = new static();

        $dto->url = $url;
        $dto->token = $token;
        $dto->trust_self_signed_certificate = $trust_self_signed_certificate;
        $dto->github_url = $github_url;
        $dto->github_token = $github_token;
        $dto->version = $version;
        $dto->description = $description;
        $dto->topics = $topics;
        $dto->homepage = $homepage;
        $dto->changelog = $changelog;
        $dto->maintainer_user_id = $maintainer_user_id;
        $dto->default_branch = $default_branch;
        $dto->develop_branch = $develop_branch;
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


    public function getDevelopBranch() : ?string
    {
        return $this->develop_branch;
    }


    public function getGithubToken() : ?string
    {
        return $this->github_token;
    }


    public function getGithubUrl() : ?string
    {
        return $this->github_url;
    }


    public function getHomepage() : ?string
    {
        return $this->homepage;
    }


    public function getMaintainerUserId() : ?int
    {
        return $this->maintainer_user_id;
    }


    public function getToken() : ?string
    {
        return $this->token;
    }


    public function getTopics() : ?array
    {
        return $this->topics;
    }


    public function getUrl() : ?string
    {
        return $this->url;
    }


    public function getVersion() : ?string
    {
        return $this->version;
    }


    public function isTrustSelfSignedCertificate() : bool
    {
        return $this->trust_self_signed_certificate;
    }


    public function jsonSerialize() : array
    {
        $json = get_object_vars($this);

        if (!empty($json["token"])) {
            $json["token"] = "***";
        }
        if (!empty($json["github_token"])) {
            $json["github_token"] = "***";
        }

        return $json;
    }
}
