<?php

namespace FluxPublishUtils\Channel\Gitlab\Port;

use FluxPublishUtils\Channel\Gitlab\Command\CreateGitlabRepositoryMergeRequestCommand;
use FluxPublishUtils\Channel\Gitlab\Command\CreateGitlabRepositoryReleaseCommand;
use FluxPublishUtils\Channel\Gitlab\Command\CreateGitlabRepositoryTagCommand;
use FluxPublishUtils\Channel\Gitlab\Command\GetGitlabRepositoryBranchesCommand;
use FluxPublishUtils\Channel\Gitlab\Command\GetGitlabRepositoryMembersCommand;
use FluxPublishUtils\Channel\Gitlab\Command\GetGitlabRepositoryRemoteMirrorsCommand;
use FluxPublishUtils\Channel\Gitlab\Command\GitlabRequestCommand;
use FluxPublishUtils\Channel\Gitlab\Command\UpdateGitlabRepositorySettingsCommand;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Api\RestApi;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\Method;

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
        string $token,
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


    public function createGitlabRepositoryRelease(int $project_id, string $tag_name, string $title, string $description, string $url, string $token, ?bool $trust_self_signed_certificate = null) : void
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


    public function createGitlabRepositoryTag(int $project_id, string $name, string $ref, string $message, string $url, string $token, ?bool $trust_self_signed_certificate = null) : void
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


    public function getGitlabRepositoryBranches(int $project_id, string $url, string $token, ?bool $trust_self_signed_certificate = null) : array
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


    public function getGitlabRepositoryMembers(int $project_id, string $url, string $token, ?bool $trust_self_signed_certificate = null) : array
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


    public function getGitlabRepositoryRemoteMirrors(int $project_id, string $url, string $token, ?bool $trust_self_signed_certificate = null) : array
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


    public function gitlabRequest(
        int $project_id,
        ?string $api_url,
        string $url,
        string $token,
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


    public function updateGitlabRepositorySettings(int $project_id, array $settings, string $url, string $token, ?bool $trust_self_signed_certificate = null) : void
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
