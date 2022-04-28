<?php

namespace FluxPublishUtils\Channel\Github\Command;

use FluxPublishUtils\Channel\Github\Port\GithubService;
use FluxPublishUtils\Libs\FluxRestApi\Adapter\Method\DefaultMethod;

class CreateGithubRepositoryReleaseCommand
{

    private function __construct(
        private readonly GithubService $github_service
    ) {

    }


    public static function new(
        GithubService $github_service
    ) : static {
        return new static(
            $github_service
        );
    }


    public function createGithubRepositoryRelease(
        string $repository,
        string $tag_name,
        string $title,
        string $description,
        bool $pre_release,
        ?string $asset_path,
        ?string $asset_name,
        string $token
    ) : void {
        $id = $this->github_service->githubRequest(
            $repository,
            "releases",
            $token,
            DefaultMethod::POST,
            [
                "tag_name"   => $tag_name,
                "name"       => $title,
                "body"       => $description,
                "prerelease" => $pre_release
            ]
        )["id"];

        if (!empty($asset_path)) {
            $this->github_service->githubUploadRequest(
                $repository,
                $asset_path,
                "releases/" . $id . "/assets",
                $token,
                DefaultMethod::POST,
                [
                    "name" => !empty($asset_name) ? $asset_name : basename($asset_path)
                ]
            );
        }
    }
}
