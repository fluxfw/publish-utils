<?php

namespace FluxPublishUtils\Service\Github\Command;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;
use FluxPublishUtils\Service\Github\Port\GithubService;
use SensitiveParameter;

class CreateGithubRepositoryReleaseCommand
{

    private function __construct(
        private readonly GithubService $github_service
    ) {

    }


    public static function new(
        GithubService $github_service
    ) : static {
        return new static(
            $github_service
        );
    }


    public function createGithubRepositoryRelease(string $repository, string $tag_name, string $title, string $description, bool $pre_release, #[SensitiveParameter] string $token) : void
    {
        $this->github_service->githubRequest(
            $repository,
            "releases",
            $token,
            DefaultMethod::POST,
            [
                "tag_name"   => $tag_name,
                "name"       => $title,
                "body"       => $description,
                "prerelease" => $pre_release
            ]
        );
    }
}
