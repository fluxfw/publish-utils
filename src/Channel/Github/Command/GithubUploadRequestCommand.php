<?php

namespace FluxPublishUtils\Channel\Github\Command;

use FluxPublishUtils\Libs\FluxRestApi\Adapter\Api\RestApi;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Authorization\HttpBasic\HttpBasic;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Client\ClientRequestDto;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Header\DefaultHeader;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\Method;

class GithubUploadRequestCommand
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


    public function githubUploadRequest(string $repository, string $path, ?string $api_url, string $token, ?Method $method = null, ?array $query_params = null) : ?array
    {
        $response = $this->rest_api->makeRequest(
            ClientRequestDto::new(
                "https://upload.github.com/repos/" . trim($repository, "/") . (!empty($api_url) ? "/" . trim($api_url, "/") : ""),
                $method ?? DefaultMethod::POST,
                $query_params,
                file_get_contents($path),
                [
                    DefaultHeader::ACCEPT->value        => "application/vnd.github.v3+json",
                    DefaultHeader::AUTHORIZATION->value => HttpBasic::BASIC_AUTHORIZATION . " " . base64_encode($token),
                    DefaultHeader::CONTENT_TYPE->value  => mime_content_type($path),
                    DefaultHeader::USER_AGENT->value    => "flux-publish-utils"
                ],
                true,
                true,
                true,
                false
            )
        );

        if (empty($data = $response?->getBody()) || empty($data = json_decode($data, true))) {
            $data = null;
        }

        return $data;
    }
}
