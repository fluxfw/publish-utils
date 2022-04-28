<?php

namespace FluxPublishUtils\Channel\Github\Port;

use FluxPublishUtils\Channel\Github\Command\CreateGithubRepositoryReleaseCommand;
use FluxPublishUtils\Channel\Github\Command\GetGithubRepositoryTagsCommand;
use FluxPublishUtils\Channel\Github\Command\GithubRequestCommand;
use FluxPublishUtils\Channel\Github\Command\UpdateGithubRepositorySettingsCommand;
use FluxPublishUtils\Channel\Github\Command\UpdateGithubRepositoryTopicsCommand;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Api\RestApi;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\Method;

class GithubService
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


    public function createGithubRepositoryRelease(string $repository, string $tag_name, string $title, string $description, bool $pre_release, string $token) : void
    {
        CreateGithubRepositoryReleaseCommand::new(
            $this
        )
            ->createGithubRepositoryRelease(
                $repository,
                $tag_name,
                $title,
                $description,
                $pre_release,
                $token
            );
    }


    public function getGithubRepositoryTags(string $repository, string $token) : array
    {
        return GetGithubRepositoryTagsCommand::new(
            $this
        )
            ->getGithubRepositoryTags(
                $repository,
                $token
            );
    }


    public function githubRequest(string $repository, ?string $api_url, string $token, ?Method $method = null, ?array $data = null) : ?array
    {
        return GithubRequestCommand::new(
            $this->rest_api
        )
            ->githubRequest(
                $repository,
                $api_url,
                $token,
                $method,
                $data
            );
    }


    public function updateGithubRepositorySettings(string $repository, array $settings, string $token) : void
    {
        UpdateGithubRepositorySettingsCommand::new(
            $this
        )
            ->updateGithubRepositorySettings(
                $repository,
                $settings,
                $token
            );
    }


    public function updateGithubRepositoryTopics(string $repository, array $topics, string $token) : void
    {
        UpdateGithubRepositoryTopicsCommand::new(
            $this
        )
            ->updateGithubRepositoryTopics(
                $repository,
                $topics,
                $token
            );
    }
}
