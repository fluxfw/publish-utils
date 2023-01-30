<?php

namespace FluxPublishUtils\Service\Gitlab\Port;

use FluxPublishUtils\Service\Gitlab\Command\CreateGitlabRepositoryMergeRequestCommand;
use FluxPublishUtils\Service\Gitlab\Command\CreateGitlabRepositoryReleaseCommand;
use FluxPublishUtils\Service\Gitlab\Command\CreateGitlabRepositoryTagCommand;
use FluxPublishUtils\Service\Gitlab\Command\GetGitlabRepositoryBranchesCommand;
use FluxPublishUtils\Service\Gitlab\Command\GetGitlabRepositoryMembersCommand;
use FluxPublishUtils\Service\Gitlab\Command\GetGitlabRepositoryRemoteMirrorsCommand;
use FluxPublishUtils\Service\Gitlab\Command\GetGitlabRepositoryTagsCommand;
use FluxPublishUtils\Service\Gitlab\Command\GitlabRequestCommand;
use FluxPublishUtils\Service\Gitlab\Command\UpdateGitlabRepositorySettingsCommand;
use FluxRestApi\Adapter\Api\RestApi;
use FluxRestApi\Adapter\Method\Method;
use SensitiveParameter;

class GitlabService
{

    private function __construct(
        private readonly RestApi $rest_api
    ) {

    }


    public static function new(
        RestApi $rest_api
    ) : static {
        return new static(
            $rest_api
        );
    }


    public function createGitlabRepositoryMergeRequest(
        int $project_id,
        string $source_branch,
        string $target_branch,
        string $title,
        int $assignee_user_id,
        string $url,
        #[SensitiveParameter] string $token,
        ?bool $trust_self_signed_certificate = null
    ) : void {
        CreateGitlabRepositoryMergeRequestCommand::new(
            $this
        )
            ->createGitlabRepositoryMergeRequest(
                $project_id,
                $source_branch,
                $target_branch,
                $title,
                $assignee_user_id,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function createGitlabRepositoryRelease(int $project_id, string $tag_name, string $title, string $description, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : void
    {
        CreateGitlabRepositoryReleaseCommand::new(
            $this
        )
            ->createGitlabRepositoryRelease(
                $project_id,
                $tag_name,
                $title,
                $description,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function createGitlabRepositoryTag(int $project_id, string $name, string $ref, string $message, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : void
    {
        CreateGitlabRepositoryTagCommand::new(
            $this
        )
            ->createGitlabRepositoryTag(
                $project_id,
                $name,
                $ref,
                $message,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function getGitlabRepositoryBranches(int $project_id, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : array
    {
        return GetGitlabRepositoryBranchesCommand::new(
            $this
        )
            ->getGitlabRepositoryBranches(
                $project_id,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function getGitlabRepositoryMembers(int $project_id, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : array
    {
        return GetGitlabRepositoryMembersCommand::new(
            $this
        )
            ->getGitlabRepositoryMembers(
                $project_id,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function getGitlabRepositoryRemoteMirrors(int $project_id, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : array
    {
        return GetGitlabRepositoryRemoteMirrorsCommand::new(
            $this
        )
            ->getGitlabRepositoryRemoteMirrors(
                $project_id,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function getGitlabRepositoryTags(int $project_id, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : array
    {
        return GetGitlabRepositoryTagsCommand::new(
            $this
        )
            ->getGitlabRepositoryTags(
                $project_id,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function gitlabRequest(
        int $project_id,
        ?string $api_url,
        string $url,
        #[SensitiveParameter] string $token,
        ?Method $method = null,
        ?array $query_params = null,
        ?array $data = null,
        ?bool $trust_self_signed_certificate = null
    ) : ?array {
        return GitlabRequestCommand::new(
            $this->rest_api
        )
            ->gitlabRequest(
                $project_id,
                $api_url,
                $url,
                $token,
                $method,
                $query_params,
                $data,
                $trust_self_signed_certificate
            );
    }


    public function updateGitlabRepositorySettings(int $project_id, array $settings, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : void
    {
        UpdateGitlabRepositorySettingsCommand::new(
            $this
        )
            ->updateGitlabRepositorySettings(
                $project_id,
                $settings,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }
}
