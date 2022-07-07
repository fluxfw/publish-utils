# flux-publish-utils

Run publish tasks (gitlab ci)

All are optional, only done if the needed infos are available

- Enable/Disable "Enable 'Delete source branch' option by default"
- Create gitlab pull request `develop` to `main` (Default branch)
    - Assigned user is first maintainer in gitlab project members
- Create gitlab/github version tag/release
    - Version from `metadata.json`|`composer.json`|`package.json` > `version`
    - Description is cut changelog from `CHANGELOG.md`
- Update project description, topics and homepage on gitlab/github
    - Description from `metadata.json`|`composer.json`|`package.json` > `description`
    - Topics from `metadata.json` > `topics`|`keywords` / `composer.json`|`package.json` > `keywords`
    - Homepage from `metadata.json`|`composer.json`|`package.json` > `homepage`

## Example

```yaml
flux-publish-utils:
    stage: build
    image: docker-registry.fluxpublisher.ch/flux-publish-utils:latest
    script:
        - publish-utils
    only:
        - main
```

```yaml
flux-publish-utils:
    stage: build
    image: docker-registry.fluxpublisher.ch/flux-publish-utils:latest
    script:
        - upload-release-asset xyz.tar.gz
    only:
        - tags
```

## CI variables

Set `FLUX_PUBLISH_UTILS_TOKEN` ci variable, protected and masked

Set `FLUX_PUBLISH_UTILS_TRUST_SELF_SIGNED_CERTIFICATE` ci variable (If it's the case), protected

Set `FLUX_PUBLISH_UTILS_TOKEN_GITHUB` ci variable, protected and masked
