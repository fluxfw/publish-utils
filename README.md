# FluxPublishUtils

Auto run the follow tasks on merge `develop` to `master` (gitlab ci)

- Auto create version tag (Optional)
    - Version from `composer.json`|`package.json`|`metadata.json` > `version`
    - Changelog from `CHANGELOG.md`
- Auto update gitlab and github project description, topics and homepage
    - Short description from `composer.json`|`package.json`|`metadata.json` > `description`
    - Topics from `composer.json`|`package.json`|`metadata.json` > `keywords`
    - Homepage from `composer.json`|`package.json`|`metadata.json` > `homepage`
- Ensure "Enable 'Delete source branch' option by default" is disabled
- Auto recreate gitlab pull request `develop` to `master`
    - Assigned user is first maintainer in gitlab project members

## Usage

### `.gitlab-ci.yml`

```yaml
include:
  - https://utils.fluxpublisher.ch/FluxPublishUtils.yml
```

### CI variables

Set `AUTO_VERSION_TAG_TOKEN` ci variable, protected and masked

Set `AUTO_VERSION_TAG_TOKEN_GITHUB` ci variable (Token), protected and masked
