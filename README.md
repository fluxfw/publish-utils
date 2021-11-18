# flux-publish-utils

Run the follow tasks on merge `develop` to `main` (gitlab ci), if available

- Create gitlab pull request `develop` to `main` (Default branch)
  - Assigned user is first maintainer in gitlab project members
  - Ensure "Enable 'Delete source branch' option by default" is disabled
- Create gitlab version tag/release
    - Version from `metadata.json`|`composer.json`|`package.json` > `version`
    - Changelog from `CHANGELOG.md`
- Update project description, topics and homepage on gitlab/github
    - Description from `metadata.json`|`composer.json`|`package.json` > `description`
    - Topics from `metadata.json`|`composer.json`|`package.json` > `keywords`
    - Homepage from `metadata.json`|`composer.json`|`package.json` > `homepage`

## Example

[examples/.gitlab-ci.yml](examples/.gitlab-ci.yml)

## CI variables

Set `FLUX_PUBLISH_UTILS_TOKEN` ci variable, protected and masked

Set `FLUX_PUBLISH_UTILS_TRUST_SELF_SIGNED_CERTIFICATE` ci variable (If it's the case), protected

Set `FLUX_PUBLISH_UTILS_TOKEN_GITHUB` ci variable (Token), protected and masked
