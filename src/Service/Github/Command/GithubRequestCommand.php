<?php

namespace FluxPublishUtils\Service\Github\Command;

use FluxRestApi\Adapter\Api\RestApi;
use FluxRestApi\Adapter\Authorization\ParseHttp\ParseHttpAuthorization_;
use FluxRestApi\Adapter\Authorization\Schema\DefaultAuthorizationSchema;
use FluxRestApi\Adapter\Body\JsonBodyDto;
use FluxRestApi\Adapter\Client\ClientRequestDto;
use FluxRestApi\Adapter\Header\DefaultHeaderKey;
use FluxRestApi\Adapter\Method\DefaultMethod;
use FluxRestApi\Adapter\Method\Method;
use SensitiveParameter;

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


    public function githubRequest(string $repository, ?string $api_url, #[SensitiveParameter] string $token, ?Method $method = null, ?array $data = null) : ?array
    {
        $headers = [
            DefaultHeaderKey::ACCEPT->value        => "application/vnd.github.mercy-preview+json",
            DefaultHeaderKey::AUTHORIZATION->value => DefaultAuthorizationSchema::BASIC->value . ParseHttpAuthorization_::SPLIT_SCHEMA_PARAMETERS . base64_encode($token)
        ];

        if ($data !== null) {
            $data = JsonBodyDto::new(
                $data
            );
        }

        $method ??= DefaultMethod::GET;
        $return = $method === DefaultMethod::GET;

        $response = $this->rest_api->makeRequest(
            ClientRequestDto::new(
                "https://api.github.com/repos/" . trim($repository, "/") . (!empty($api_url) ? "/" . trim($api_url, "/") : ""),
                $method,
                null,
                null,
                $headers,
                $data,
                null,
                null,
                $return,
                true,
                true,
                false
            )
        );

        if (!$return || empty($data = $response?->raw_body) || empty($data = json_decode($data, true))) {
            $data = null;
        }

        return $data;
    }
}
