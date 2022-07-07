<?php

namespace FluxPublishUtils\Adapter\Api;

use FluxPublishUtils\Adapter\Info\InfoDto;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Api\RestApi;
use FluxPublishUtils\Service\Github\Port\GithubService;
use FluxPublishUtils\Service\Gitlab\Port\GitlabService;
use FluxPublishUtils\Service\Info\Port\InfoService;

class PublishUtilsApi
{

    private function __construct()
    {

    }


    public static function new() : static
    {
        return new static();
    }


    public function collectInfo() : InfoDto
    {
        return $this->getInfoService()
            ->collectInfo();
    }


    public function createGithubRepositoryRelease(string $repository, string $tag_name, string $title, string $description, bool $pre_release, string $token) : void
    {
        $this->getGithubService()
            ->createGithubRepositoryRelease(
                $repository,
                $tag_name,
                $title,
                $description,
                $pre_release,
                $token
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
        $this->getGitlabService()
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
        $this->getGitlabService()
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
        $this->getGitlabService()
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


    public function getGithubRepositoryReleaseByTag(string $repository, string $tag_name, string $token) : array
    {
        return $this->getGithubService()
            ->getGithubRepositoryReleaseByTag(
                $repository,
                $tag_name,
                $token
            );
    }


    public function getGithubRepositoryTags(string $repository, string $token) : array
    {
        return $this->getGithubService()
            ->getGithubRepositoryTags(
                $repository,
                $token
            );
    }


    public function getGitlabRepositoryBranches(int $project_id, string $url, string $token, ?bool $trust_self_signed_certificate = null) : array
    {
        return $this->getGitlabService()
            ->getGitlabRepositoryBranches(
                $project_id,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function getGitlabRepositoryMembers(int $project_id, string $url, string $token, ?bool $trust_self_signed_certificate = null) : array
    {
        return $this->getGitlabService()
            ->getGitlabRepositoryMembers(
                $project_id,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function getGitlabRepositoryRemoteMirrors(int $project_id, string $url, string $token, ?bool $trust_self_signed_certificate = null) : array
    {
        return $this->getGitlabService()
            ->getGitlabRepositoryRemoteMirrors(
                $project_id,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function updateGithubRepositorySettings(string $repository, array $settings, string $token) : void
    {
        $this->getGithubService()
            ->updateGithubRepositorySettings(
                $repository,
                $settings,
                $token
            );
    }


    public function updateGithubRepositoryTopics(string $repository, array $topics, string $token) : void
    {
        $this->getGithubService()
            ->updateGithubRepositoryTopics(
                $repository,
                $topics,
                $token
            );
    }


    public function updateGitlabRepositorySettings(int $project_id, array $settings, string $url, string $token, ?bool $trust_self_signed_certificate = null) : void
    {
        $this->getGitlabService()
            ->updateGitlabRepositorySettings(
                $project_id,
                $settings,
                $url,
                $token,
                $trust_self_signed_certificate
            );
    }


    public function uploadGithubRepositoryReleaseAsset(string $repository, int $release_id, string $file, string $token) : void
    {
        $this->getGithubService()
            ->uploadGithubRepositoryReleaseAsset(
                $repository,
                $release_id,
                $file,
                $token
            );
    }


    private function getGithubService() : GithubService
    {
        return GithubService::new(
            $this->getRestApi()
        );
    }


    private function getGitlabService() : GitlabService
    {
        return GitlabService::new(
            $this->getRestApi()
        );
    }


    private function getInfoService() : InfoService
    {
        return InfoService::new(
            $this->getGitlabService(),
            $this->getGithubService()
        );
    }


    private function getRestApi() : RestApi
    {
        return RestApi::new();
    }
}
