# flux-publish-utils

Some utils for publish

## Installation

Add the files in [bin/HOST_PATH](bin/HOST_PATH) to your PATH

### Github

For the github commands you need to set the environment variable `FLUX_PUBLISH_UTILS_GITHUB_TOKEN_FILE` with the path to the file contains your github token (`public_repo` scope)

The github repository name is taken from `.git/config`

## Commands

### create-github-release

```shell
create-github-release /path/to/project
```

- Creates a new github release
  - The tag is [get-release-tag](#get-release-tag)
  - The title is [get-release-title](#get-release-title)
  - The description is [get-release-description](#get-release-description)
  - If the tag contains `alpha`, `beta`, `pre` or `rc`, it will marked as a pre release

### get-release-changelog

```shell
get-release-changelog /path/to/project
```

Gets the current version entry from `CHANGELOG.md`

### get-release-description

```shell
get-release-description /path/to/project
```

Gets [get-release-changelog](#get-release-changelog) without header

### get-release-tag

```shell
get-release-tag /path/to/project
```

Gets [get-release-version](#get-release-version) with `v`

### get-release-title

```shell
get-release-title /path/to/project
```

- Gets [get-release-changelog](#get-release-changelog) header without tag
  - If no title, [get-release-tag](#get-release-tag) is used

### get-release-version

```shell
get-release-version /path/to/project
```

Gets the current `version` file

### tag-release

```shell
tag-release /path/to/project
```

- Creates a new git tag and push it
  - The tag is [get-release-tag](#get-release-tag)
  - The message is [get-release-description](#get-release-description)

### update-release-version

```shell
update-release-version /path/to/project
```

- Updates the `version` file to current date in format `YYYY-MM-DD-I`
  - If the version is already the current date, it will increase `I`, else `I` is `1`
- Adds a new entry in `CHANGELOG.md` for the new version
  - If exists an entry for `latest`, it will take this as base for the version entry
  - Adds a new entry for `latest` (Replaces if `latest` exists)

### upload-asset-to-github-release

```shell
upload-asset-to-github-release /path/to/project path/to/asset/in/project [asset-name]
```

- Upload an asset to github release
  - The release is from [get-release-tag](#get-release-tag)
  - If no asset name the basename of the asset path is used
