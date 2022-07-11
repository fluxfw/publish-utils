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


    public function uploadGithubRepositoryReleaseAsset(string $repository, int $release_id, string $file, ?string $name, string $token) : void
    {
        $this->rest_api->makeRequest(
            ClientRequestDto::new(
                "https://uploads.github.com/repos/" . trim($repository, "/") . "/releases/" . $release_id . "/assets",
                DefaultMethod::POST,
                [
                    "name" => $name ?: basename($file)
                ],
                null,
                [
                    DefaultHeaderKey::ACCEPT->value        => "application/vnd.github+json",
                    DefaultHeaderKey::AUTHORIZATION->value => DefaultAuthorizationSchema::BASIC->value . ParseHttpAuthorization_::SPLIT_SCHEMA_PARAMETERS . base64_encode($token),
                    DefaultHeaderKey::USER_AGENT->value    => "flux-publish-utils"
                ],
                null,
                null,
                $file,
                false,
                true,
                true,
                false
            )
        );
    }
}
