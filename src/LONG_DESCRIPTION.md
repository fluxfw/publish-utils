## Description

- Auto create version tag on merge `develop` to `master`
  - Version from `composer.json` > `version`
  - Changelog from `CHANGELOG.md`
- Auto update gitlab project description
  - Short description from `composer.json` > `description`
- Auto recreate gitlab pull request `develop` to `master`
  - Assign user is first maintainer in gitlab project members

## Usage

### `.gitlab-ci.yml`

```yaml
include:
  - https://plugins.studer-raimann.ch/Customizing/global/auto_version_tag_ci/build/auto_version_tag_ci.yml
```

### CI variables

Set `AUTO_VERSION_TAG_TOKEN` ci variable, protected and masked
