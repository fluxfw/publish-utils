<?php

namespace FluxPublishUtils\Channel\Github\Command;

use FluxPublishUtils\Channel\Github\Port\GithubService;

class GetGithubRepositoryTagsCommand
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


    public function getGithubRepositoryTags(string $repository, string $token) : array
    {
        return $this->github_service->githubRequest(
                $repository,
                "tags",
                $token
            ) ?? [];
    }
}
