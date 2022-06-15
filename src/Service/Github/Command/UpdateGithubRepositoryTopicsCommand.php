<?php

namespace FluxPublishUtils\Service\Github\Command;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;
use FluxPublishUtils\Service\Github\Port\GithubService;

class UpdateGithubRepositoryTopicsCommand
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


    public function updateGithubRepositoryTopics(string $repository, array $topics, string $token) : void
    {
        $this->github_service->githubRequest(
            $repository,
            "topics",
            $token,
            DefaultMethod::PUT,
            [
                "names" => $topics
            ]
        );
    }
}
