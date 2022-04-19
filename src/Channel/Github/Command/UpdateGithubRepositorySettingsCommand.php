<?php

namespace FluxPublishUtils\Channel\Github\Command;

use FluxPublishUtils\Channel\Github\Port\GithubService;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;

class UpdateGithubRepositorySettingsCommand
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


    public function updateGithubRepositorySettings(string $repository, array $settings, string $token) : void
    {
        $this->github_service->githubRequest(
            $repository,
            null,
            $token,
            DefaultMethod::PATCH,
            $settings
        );
    }
}
