<?php

namespace FluxPublishUtils\Service\Gitlab\Command;

use FluxRestApi\Adapter\Api\RestApi;
use FluxRestApi\Adapter\Body\JsonBodyDto;
use FluxRestApi\Adapter\Body\Type\DefaultBodyType;
use FluxRestApi\Adapter\Client\ClientRequestDto;
use FluxRestApi\Adapter\Header\DefaultHeaderKey;
use FluxRestApi\Adapter\Method\DefaultMethod;
use FluxRestApi\Adapter\Method\Method;
use SensitiveParameter;

class GitlabRequestCommand
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


    public function gitlabRequest(
        int $project_id,
        ?string $api_url,
        string $url,
        #[SensitiveParameter] string $token,
        ?Method $method = null,
        ?array $query_params = null,
        ?array $data = null,
        ?bool $trust_self_signed_certificate = null
    ) : ?array {
        $headers = [
            "PRIVATE-TOKEN"                     => $token,
            DefaultHeaderKey::USER_AGENT->value => "flux-publish-utils"
        ];

        if ($data !== null) {
            $data = JsonBodyDto::new(
                $data
            );
        }

        $method ??= DefaultMethod::GET;
        $return = $method === DefaultMethod::GET;
        if ($return) {
            $headers[DefaultHeaderKey::ACCEPT->value] = DefaultBodyType::JSON->value;
        }

        $response = $this->rest_api->makeRequest(
            ClientRequestDto::new(
                rtrim($url, "/") . "/api/v4/projects/" . $project_id . (!empty($api_url) ? "/" . trim($api_url, "/") : ""),
                $method,
                $query_params,
                null,
                $headers,
                $data,
                null,
                null,
                $return,
                true,
                true,
                $trust_self_signed_certificate
            )
        );

        if (!$return || empty($data = $response?->raw_body) || empty($data = json_decode($data, true))) {
            $data = null;
        }

        return $data;
    }
}
