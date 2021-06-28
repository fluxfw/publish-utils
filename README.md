# FluxPublishUtils

Auto run the follow tasks on merge `develop` to `main` (gitlab ci)

- Ensure "Enable 'Delete source branch' option by default" is disabled
- Auto recreate gitlab pull request `develop` to `main` (Default branch)
  - Assigned user is first maintainer in gitlab project members
- Auto create version tag/release (Optional)
    - Version from `composer.json`|`package.json`|`metadata.json` > `version`
    - Changelog from `CHANGELOG.md`
- Auto update gitlab and github project description, topics and homepage
    - Short description from `composer.json`|`package.json`|`metadata.json` > `description`
    - Topics from `composer.json`|`package.json`|`metadata.json` > `keywords`
    - Homepage from `composer.json`|`package.json`|`metadata.json` > `homepage`

## Example

[examples/.gitlab-ci.yml](examples/.gitlab-ci.yml)

## CI variables

Set `FLUX_PUBLISH_UTILS_TOKEN` ci variable, protected and masked

Set `FLUX_PUBLISH_UTILS_TOKEN_GITHUB` ci variable (Token), protected and masked
