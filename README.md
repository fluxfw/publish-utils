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
- Upload assets to github release

## CI variables

Set `FLUX_PUBLISH_UTILS_TOKEN` ci variable, protected and masked

Set `FLUX_PUBLISH_UTILS_TRUST_SELF_SIGNED_CERTIFICATE` ci variable (If it's the case), protected

Set `FLUX_PUBLISH_UTILS_TOKEN_GITHUB` ci variable, protected and masked

## Basic

```yaml
publish-utils:
    stage: build
    image: php:cli-alpine
    script:
        - (mkdir -p flux-publish-utils && cd flux-publish-utils && wget -O - https://github.com/flux-eco/flux-publish-utils/releases/download/%tag%/flux-publish-utils-%tag%-build.tar.gz | tar -xz --strip-components=1)
        - flux-publish-utils/bin/publish-utils.php
    only:
        - main
```

## Cache

```yaml
publish-utils:
    ...
    script:
        - (if [ ! -d flux-publish-utils ]; then mkdir -p flux-publish-utils && cd flux-publish-utils && wget -O - https://github.com/flux-eco/flux-publish-utils/releases/download/%tag%/flux-publish-utils-%tag%-build.tar.gz | tar -xz --strip-components=1; fi)
        - ...
    cache:
        key: publish-utils
        paths:
            - flux-publish-utils
    ...
```

## Upload assets to release

```yaml
publish-utils:
    ...
    script:
        - ...
        - flux-publish-utils/bin/upload-release-asset.php xyz.tar.gz
    ...
```
