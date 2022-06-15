<?php

namespace FluxPublishUtils\Service\Github\Command;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;
use FluxPublishUtils\Service\Github\Port\GithubService;

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
