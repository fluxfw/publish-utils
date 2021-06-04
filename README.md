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

## Server

### Environment variables

| Variable | Description | Default value |
| -------- | ----------- | ------------- |
| FLUX_NGINX_WEB_DIR | Web directory | /var/www/html |
| FLUX_NGINX_HTTPS_CERT | Path to HTTPS certificate file<br>Set this will enable listen on HTTPS and redirect HTTP to HTTPS<br>Should be on a volume | - |
| FLUX_NGINX_HTTPS_KEY | Path to HTTPS key file<br>Should be on a volume | - |
| FLUX_NGINX_HTTPS_DHPARAM | Path to HTTPS pem file<br>Should be on a volume | - |
| FLUX_NGINX_HTTP_PORT | Listen HTTP port | 80 |
| FLUX_NGINX_HTTPS_PORT | Listen HTTPS port | 443 |
| FLUX_NGINX_LISTEN | Listen IP | 0.0.0.0 |

Minimal variables required to set are **bold**

### Example

[examples/docker-compose.yml](examples/docker-compose.yml)

## Usage

### `.gitlab-ci.yml`

```yaml
include:
  - https://utils.fluxpublisher.ch/FluxPublishUtils.yml
```

### CI variables

Set `FLUX_PUBLISH_UTILS_TOKEN` ci variable, protected and masked

Set `FLUX_PUBLISH_UTILS_TOKEN_GITHUB` ci variable (Token), protected and masked
