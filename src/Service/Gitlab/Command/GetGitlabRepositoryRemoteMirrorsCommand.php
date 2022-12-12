<?php

namespace FluxPublishUtils\Service\Gitlab\Command;

use FluxPublishUtils\Service\Gitlab\Port\GitlabService;
use SensitiveParameter;

class GetGitlabRepositoryRemoteMirrorsCommand
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


    public function getGitlabRepositoryRemoteMirrors(int $project_id, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : array
    {
        return $this->gitlab_service->gitlabRequest(
            $project_id,
            "remote_mirrors",
            $url,
            $token,
            null,
            null,
            null,
            $trust_self_signed_certificate
        ) ?? [];
    }
}
