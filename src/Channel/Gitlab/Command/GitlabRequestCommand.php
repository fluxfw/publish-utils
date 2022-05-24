<?php

namespace FluxPublishUtils\Channel\Gitlab\Command;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Api\RestApi;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Body\Type\DefaultBodyType;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Client\ClientRequestDto;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Header\DefaultHeaderKey;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\Method;

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
        string $token,
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
            $headers[DefaultHeaderKey::CONTENT_TYPE->value] = DefaultBodyType::JSON->value;
            $data = json_encode($data, JSON_UNESCAPED_SLASHES);
        }

        $method ??= DefaultMethod::GET;
        $return = $method === DefaultMethod::GET;
        if ($return) {
            $headers[DefaultHeaderKey::ACCEPT->value] = DefaultBodyType::JSON->value;
        }

        $response = $this->rest_api->makeRequest(
            ClientRequestDto::new(
                rtrim($url, "/") . "/api/v4/projects/" . trim($project_id, "/") . (!empty($api_url) ? "/" . trim($api_url, "/") : ""),
                $method,
                $query_params,
                $data,
                $headers,
                $return,
                true,
                true,
                $trust_self_signed_certificate
            )
        );

        if (!$return || empty($data = $response?->getBody()) || empty($data = json_decode($data, true))) {
            $data = null;
        }

        return $data;
    }
}
