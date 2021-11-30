ARG PHP_CLI_IMAGE=php:cli-alpine
ARG REST_BASE_API_IMAGE=docker-registry.fluxpublisher.ch/flux-rest/base-api:latest

FROM $REST_BASE_API_IMAGE AS rest_base_api

FROM $PHP_CLI_IMAGE

LABEL org.opencontainers.image.source="https://github.com/fluxapps/flux-publish-utils"
LABEL maintainer="fluxlabs <support@fluxlabs.ch> (https://fluxlabs.ch)"

COPY --from=rest_base_api /flux-rest-base-api /flux-publish-utils/libs/flux-rest-base-api
COPY . /flux-publish-utils

ENTRYPOINT ["/flux-publish-utils/bin/entrypoint.php"]
