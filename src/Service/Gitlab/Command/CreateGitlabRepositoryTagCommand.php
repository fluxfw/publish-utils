<?php

namespace FluxPublishUtils\Service\Gitlab\Command;

use FluxPublishUtils\Service\Gitlab\Port\GitlabService;
use FluxRestApi\Adapter\Method\DefaultMethod;
use SensitiveParameter;

class CreateGitlabRepositoryTagCommand
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


    public function createGitlabRepositoryTag(int $project_id, string $name, string $ref, string $message, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : void
    {
        $this->gitlab_service->gitlabRequest(
            $project_id,
            "repository/tags",
            $url,
            $token,
            DefaultMethod::POST,
            [
                "tag_name" => $name,
                "ref"      => $ref,
                "message"  => $message
            ],
            null,
            $trust_self_signed_certificate
        );
    }
}
