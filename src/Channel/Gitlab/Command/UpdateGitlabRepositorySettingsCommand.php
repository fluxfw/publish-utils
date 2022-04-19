<?php

namespace FluxPublishUtils\Channel\Gitlab\Command;

use FluxPublishUtils\Channel\Gitlab\Port\GitlabService;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;

class UpdateGitlabRepositorySettingsCommand
{

    private function __construct(
        private readonly GitlabService $gitlab_service
    ) {

    }


    public static function new(
        GitlabService $gitlab_service
    ) : static {
        return new static(
            $gitlab_service
        );
    }


    public function updateGitlabRepositorySettings(int $project_id, array $settings, string $url, string $token, ?bool $trust_self_signed_certificate = null) : void
    {
        $this->gitlab_service->gitlabRequest(
            $project_id,
            null,
            $url,
            $token,
            DefaultMethod::PUT,
            null,
            $settings,
            $trust_self_signed_certificate
        );
    }
}
