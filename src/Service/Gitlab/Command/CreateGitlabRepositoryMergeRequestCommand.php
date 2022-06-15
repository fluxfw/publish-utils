<?php

namespace FluxPublishUtils\Service\Gitlab\Command;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;
use FluxPublishUtils\Service\Gitlab\Port\GitlabService;

class CreateGitlabRepositoryMergeRequestCommand
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


    public function createGitlabRepositoryMergeRequest(
        int $project_id,
        string $source_branch,
        string $target_branch,
        string $title,
        int $assignee_user_id,
        string $url,
        string $token,
        ?bool $trust_self_signed_certificate = null
    ) : void {
        $this->gitlab_service->gitlabRequest(
            $project_id,
            "merge_requests",
            $url,
            $token,
            DefaultMethod::POST,
            [
                "source_branch" => $source_branch,
                "target_branch" => $target_branch,
                "title"         => $title,
                "assignee_id"   => $assignee_user_id
            ],
            null,
            $trust_self_signed_certificate
        );
    }
}
