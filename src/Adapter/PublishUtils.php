<?php

namespace FluxPublishUtils\Adapter;

use FluxPublishUtils\Adapter\Api\PublishUtilsApi;
use Throwable;

class PublishUtils
{

    private function __construct(
        private readonly PublishUtilsApi $publish_utils_api
    ) {

    }


    public static function new() : static
    {
        return new static(
            PublishUtilsApi::new()
        );
    }


    public function run() : void
    {
        try {
            echo "> Collect infos\n";
            $info = $this->publish_utils_api->collectInfo();
            echo json_encode($info, JSON_UNESCAPED_SLASHES) . "\n";

            if (!empty($info->gitlab_url) && !empty($info->gitlab_project_id) && !empty($info->gitlab_token)) {
                if (!empty($info->default_branch) && !empty($info->gitlab_develop_branch) && !empty($info->gitlab_maintainer_user_id)) {
                    echo "> Ensure \"Enable 'Delete source branch' option by default\" is disabled\n";
                    $this->publish_utils_api->updateGitlabRepositorySettings(
                        $info->gitlab_project_id,
                        [
                            "remove_source_branch_after_merge" => false
                        ],
                        $info->gitlab_url,
                        $info->gitlab_token,
                        $info->gitlab_trust_self_signed_certificate
                    );

                    echo "> Create gitlab pull request `" . $info->gitlab_develop_branch . "` to `" . $info->default_branch . "` and assign it to user `" . $info->gitlab_maintainer_user_id . "`\n";
                    $this->publish_utils_api->createGitlabRepositoryMergeRequest(
                        $info->gitlab_project_id,
                        $info->gitlab_develop_branch,
                        $info->default_branch,
                        "Draft: " . ucfirst($info->gitlab_develop_branch),
                        $info->gitlab_maintainer_user_id,
                        $info->gitlab_url,
                        $info->gitlab_token,
                        $info->gitlab_trust_self_signed_certificate
                    );
                }

                if (!empty($info->tag_name) && !empty($info->release_title) && !empty($info->changelog) && !empty($info->commit_id)) {
                    echo "> Create gitlab tag `" . $info->tag_name . "`\n";
                    $this->publish_utils_api->createGitlabRepositoryTag(
                        $info->gitlab_project_id,
                        $info->tag_name,
                        $info->commit_id,
                        $info->changelog,
                        $info->gitlab_url,
                        $info->gitlab_token,
                        $info->gitlab_trust_self_signed_certificate
                    );

                    echo "> Create gitlab release `" . $info->tag_name . "`\n";
                    $this->publish_utils_api->createGitlabRepositoryRelease(
                        $info->gitlab_project_id,
                        $info->tag_name,
                        $info->release_title,
                        $info->changelog,
                        $info->gitlab_url,
                        $info->gitlab_token,
                        $info->gitlab_trust_self_signed_certificate
                    );

                    if (!empty($info->github_repository) && !empty($info->github_token) && $info->check_github_tag !== null) {
                        echo "> Check github tag `" . $info->tag_name . "` exists\n";
                        while (!($info->check_github_tag)()) {
                            echo "Missing github tag " . $info->tag_name . " - Waiting 30 seconds for check again (Mirroring is may delayed)\n";
                            sleep(30);
                        }

                        echo "> Create github release `" . $info->tag_name . "`\n";
                        $this->publish_utils_api->createGithubRepositoryRelease(
                            $info->github_repository,
                            $info->tag_name,
                            $info->release_title,
                            $info->changelog,
                            $info->pre_release,
                            $info->github_token
                        );
                    }
                }

                if (!empty($info->description || !empty($info->topics) || !empty($info->homepage))) {
                    echo "> Update project description and topics on gitlab\n";
                    $this->publish_utils_api->updateGitlabRepositorySettings(
                        $info->gitlab_project_id,
                        [
                            "description" => $info->description,
                            "topics"      => $info->topics
                        ],
                        $info->gitlab_url,
                        $info->gitlab_token,
                        $info->gitlab_trust_self_signed_certificate
                    );

                    if (!empty($info->github_repository) && !empty($info->github_token)) {
                        echo "> Update project description and homepage on github\n";
                        $this->publish_utils_api->updateGithubRepositorySettings(
                            $info->github_repository,
                            [
                                "description" => $info->description,
                                "homepage"    => $info->homepage
                            ],
                            $info->github_token
                        );

                        echo "> Update project topics on github\n";
                        $this->publish_utils_api->updateGithubRepositoryTopics(
                            $info->github_repository,
                            $info->topics,
                            $info->github_token
                        );
                    }
                }
            }
        } catch (Throwable $ex) {
            echo $ex->getMessage();
            die(1);
        }
    }
}
