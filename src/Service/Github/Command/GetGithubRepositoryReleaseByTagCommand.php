<?php

namespace FluxPublishUtils\Service\Github\Command;

use FluxPublishUtils\Service\Github\Port\GithubService;

class GetGithubRepositoryReleaseByTagCommand
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


    public function getGithubRepositoryReleaseByTag(string $repository, string $tag_name, string $token) : array
    {
        return $this->github_service->githubRequest(
                $repository,
                "releases/tags/{tag}",
                $token,
                null,
                null,
                [
                    "tag" => $tag_name
                ]
            ) ?? [];
    }
}
