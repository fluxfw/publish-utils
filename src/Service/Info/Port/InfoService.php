<?php

namespace FluxPublishUtils\Service\Info\Port;

use FluxPublishUtils\Adapter\Info\InfoDto;
use FluxPublishUtils\Service\Github\Port\GithubService;
use FluxPublishUtils\Service\Gitlab\Port\GitlabService;
use FluxPublishUtils\Service\Info\Command\CollectInfoCommand;

class InfoService
{

    private function __construct(
        private readonly GitlabService $gitlab_service,
        private readonly GithubService $github_service
    ) {

    }


    public static function new(
        GitlabService $gitlab_service,
        GithubService $github_service
    ) : static {
        return new static(
            $gitlab_service,
            $github_service
        );
    }


    public function collectInfo() : InfoDto
    {
        return CollectInfoCommand::new(
            $this->gitlab_service,
            $this->github_service
        )
            ->collectInfo();
    }
}
