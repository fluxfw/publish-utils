# publish-utils

## Installation

Add the files in [HOST_PATH](HOST_PATH) to your PATH

### Gitea (Purposed for forgejo)

For the gitea commands you need to set the environment variable `PUBLISH_UTILS_GITEA_TOKEN_FILE` with the path to the file contains your gitea token (`write:repository` scope)

The gitea host and repository name is taken from `.git/config` in project

Optionally set the environment variable `PUBLISH_UTILS_GITEA_HTTPS_CERTIFICATE_FILE` with the path to the file contains your gitea https certificate (For trust self signed)

### Github

For the github commands you need to set the environment variable `PUBLISH_UTILS_GITHUB_TOKEN_FILE` with the path to the file contains your github token (`public_repo` scope)

The github repository name is taken from `.git/config` in project

## Commands

### publish-utils-create-gitea-release

```shell
publish-utils-create-gitea-release /path/to/project
```

- Creates a new gitea release
  - The tag is [publish-utils-get-release-tag](#publish-utils-get-release-tag)
  - The title is [publish-utils-get-release-title](#publish-utils-get-release-title)
  - The description is [publish-utils-get-release-description](#publish-utils-get-release-description)
  - If the tag contains `alpha`, `beta`, `pre` or `rc`, it will marked as a pre release

### publish-utils-create-github-release

```shell
publish-utils-create-github-release /path/to/project
```

- Creates a new github release
  - The tag is [publish-utils-get-release-tag](#publish-utils-get-release-tag)
  - The title is [publish-utils-get-release-title](#publish-utils-get-release-title)
  - The description is [publish-utils-get-release-description](#publish-utils-get-release-description)
  - If the tag contains `alpha`, `beta`, `pre` or `rc`, it will marked as a pre release

### publish-utils-get-release-changelog

```shell
publish-utils-get-release-changelog /path/to/project
```

Gets the current version entry from `CHANGELOG.md`

### publish-utils-get-release-description

```shell
publish-utils-get-release-description /path/to/project
```

Gets [publish-utils-get-release-changelog](#publish-utils-get-release-changelog) without header

### publish-utils-get-release-tag

```shell
publish-utils-get-release-tag /path/to/project
```

Gets [publish-utils-get-release-version](#publish-utils-get-release-version) with `v`

### publish-utils-get-release-title

```shell
publish-utils-get-release-title /path/to/project
```

- Gets [publish-utils-get-release-changelog](#publish-utils-get-release-changelog) header without tag
  - If no title, [publish-utils-get-release-tag](#publish-utils-get-release-tag) is used

### publish-utils-get-release-version

```shell
publish-utils-get-release-version /path/to/project
```

Gets the current `version` file

### publish-utils-revoke-gitea-release

```shell
publish-utils-revoke-gitea-release /path/to/project
```

- Revokes a gitea release
  - The release is from [publish-utils-get-release-tag](#publish-utils-get-release-tag)

### publish-utils-revoke-github-release

```shell
publish-utils-revoke-github-release /path/to/project
```

- Revokes a github release
  - The release is from [publish-utils-get-release-tag](#publish-utils-get-release-tag)

### publish-utils-revoke-tag-release

```shell
publish-utils-revoke-tag-release /path/to/project
```

- Revokes a git tag and pushes it
  - The tag is [publish-utils-get-release-tag](#publish-utils-get-release-tag)

### publish-utils-tag-release

```shell
publish-utils-tag-release /path/to/project
```

- Creates a new git tag and pushes it
  - The tag is [publish-utils-get-release-tag](#publish-utils-get-release-tag)
  - The message is [publish-utils-get-release-description](#publish-utils-get-release-description)

### publish-utils-update-release-version

```shell
publish-utils-update-release-version /path/to/project
```

- Updates the `version` file to current date in format `YYYY-MM-DD-I`
  - If the version is already the current date, it will increase `I`, else `I` is `1`
- Adds a new entry in `CHANGELOG.md` for the new version
  - If exists an entry for `latest`, it will take this as base for the version entry
  - Adds a new entry for `latest` (Replaces if `latest` exists)

### publish-utils-upload-asset-to-gitea-release

```shell
publish-utils-upload-asset-to-gitea-release /path/to/project path/to/asset/in/project [asset-name]
```

- Upload an asset to gitea release
  - The release is from [publish-utils-get-release-tag](#publish-utils-get-release-tag)
  - If no asset name the basename of the asset path is used

### publish-utils-upload-asset-to-github-release

```shell
publish-utils-upload-asset-to-github-release /path/to/project path/to/asset/in/project [asset-name]
```

- Upload an asset to github release
  - The release is from [publish-utils-get-release-tag](#publish-utils-get-release-tag)
  - If no asset name the basename of the asset path is used
