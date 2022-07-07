<?php

namespace FluxPublishUtils\Service\Github\Port;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Api\RestApi;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\Method;
use FluxPublishUtils\Service\Github\Command\CreateGithubRepositoryReleaseCommand;
use FluxPublishUtils\Service\Github\Command\GetGithubRepositoryReleaseByTagCommand;
use FluxPublishUtils\Service\Github\Command\GetGithubRepositoryTagsCommand;
use FluxPublishUtils\Service\Github\Command\GithubRequestCommand;
use FluxPublishUtils\Service\Github\Command\UpdateGithubRepositorySettingsCommand;
use FluxPublishUtils\Service\Github\Command\UpdateGithubRepositoryTopicsCommand;
use FluxPublishUtils\Service\Github\Command\UploadGithubRepositoryReleaseAssetCommand;

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


    public function getGithubRepositoryReleaseByTag(string $repository, string $tag_name, string $token) : array
    {
        return GetGithubRepositoryReleaseByTagCommand::new(
            $this
        )
            ->getGithubRepositoryReleaseByTag(
                $repository,
                $tag_name,
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


    public function uploadGithubRepositoryReleaseAsset(string $repository, int $release_id, string $file, string $token) : void
    {
        UploadGithubRepositoryReleaseAssetCommand::new(
            $this->rest_api
        )
            ->uploadGithubRepositoryReleaseAsset(
                $repository,
                $release_id,
                $file,
                $token
            );
    }
}
