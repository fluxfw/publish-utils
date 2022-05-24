<?php

namespace FluxPublishUtils\Channel\Github\Command;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Api\RestApi;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Authorization\ParseHttp\ParseHttpAuthorization_;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Authorization\Schema\LegacyDefaultAuthorizationSchema;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Body\Type\DefaultBodyType;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Client\ClientRequestDto;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Header\DefaultHeaderKey;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\Method;

class GithubRequestCommand
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


    public function githubRequest(string $repository, ?string $api_url, string $token, ?Method $method = null, ?array $data = null) : ?array
    {
        $headers = [
            DefaultHeaderKey::ACCEPT->value        => "application/vnd.github.mercy-preview+json",
            DefaultHeaderKey::AUTHORIZATION->value => LegacyDefaultAuthorizationSchema::BASIC()->value . ParseHttpAuthorization_::SPLIT_SCHEMA_PARAMETERS . base64_encode($token),
            DefaultHeaderKey::USER_AGENT->value    => "flux-publish-utils"
        ];

        if ($data !== null) {
            $headers[DefaultHeaderKey::CONTENT_TYPE->value] = DefaultBodyType::JSON->value;
            $data = json_encode($data, JSON_UNESCAPED_SLASHES);
        }

        $method ??= DefaultMethod::GET;
        $return = $method === DefaultMethod::GET;

        $response = $this->rest_api->makeRequest(
            ClientRequestDto::new(
                "https://api.github.com/repos/" . trim($repository, "/") . (!empty($api_url) ? "/" . trim($api_url, "/") : ""),
                $method,
                null,
                $data,
                $headers,
                $return,
                true,
                true,
                false
            )
        );

        if (!$return || empty($data = $response?->getBody()) || empty($data = json_decode($data, true))) {
            $data = null;
        }

        return $data;
    }
}
