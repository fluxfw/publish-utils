<?php

namespace FluxPublishUtils\Service\Gitlab\Command;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;
use FluxPublishUtils\Service\Gitlab\Port\GitlabService;
use SensitiveParameter;

class CreateGitlabRepositoryReleaseCommand
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


    public function createGitlabRepositoryRelease(int $project_id, string $tag_name, string $title, string $description, string $url, #[SensitiveParameter] string $token, ?bool $trust_self_signed_certificate = null) : void
    {
        $this->gitlab_service->gitlabRequest(
            $project_id,
            "releases",
            $url,
            $token,
            DefaultMethod::POST,
            [
                "tag_name"    => $tag_name,
                "name"        => $title,
                "description" => $description
            ],
            null,
            $trust_self_signed_certificate
        );
    }
}
