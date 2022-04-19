<?php

namespace FluxPublishUtils\Channel\Gitlab\Command;

use FluxPublishUtils\Channel\Gitlab\Port\GitlabService;

class GetGitlabRepositoryBranchesCommand
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


    public function getGitlabRepositoryBranches(int $project_id, string $url, string $token, ?bool $trust_self_signed_certificate = null) : array
    {
        return $this->gitlab_service->gitlabRequest(
                $project_id,
                "repository/branches",
                $url,
                $token,
                null,
                null,
                null,
                $trust_self_signed_certificate
            ) ?? [];
    }
}
