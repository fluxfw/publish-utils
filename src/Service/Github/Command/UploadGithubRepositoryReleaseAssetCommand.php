<?php

namespace FluxPublishUtils\Service\Github\Command;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Api\RestApi;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Authorization\ParseHttp\ParseHttpAuthorization_;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Authorization\Schema\DefaultAuthorizationSchema;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Client\ClientRequestDto;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Header\DefaultHeaderKey;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;

class UploadGithubRepositoryReleaseAssetCommand
{

    private function __construct(
        private readonly RestApi $rest_api
    ) {

    }


    public static function new(
        RestApi $rest_api
    ) : static {
        return new static(
            $rest_api
        );
    }


    public function uploadGithubRepositoryReleaseAsset(string $repository, int $release_id, string $file, string $token) : void
    {
        $this->rest_api->makeRequest(
            ClientRequestDto::new(
                "https://uploads.github.com/repos/" . trim($repository, "/") . "/releases/" . $release_id . "/assets",
                DefaultMethod::POST,
                null,
                file_get_contents($file),
                [
                    DefaultHeaderKey::ACCEPT->value        => "application/vnd.github+json",
                    DefaultHeaderKey::AUTHORIZATION->value => DefaultAuthorizationSchema::BASIC->value . ParseHttpAuthorization_::SPLIT_SCHEMA_PARAMETERS . base64_encode($token),
                    DefaultHeaderKey::CONTENT_TYPE->value  => mime_content_type($file),
                    DefaultHeaderKey::USER_AGENT->value    => "flux-publish-utils"
                ],
                null,
                null,
                false,
                true,
                true,
                false
            )
        );
    }
}
