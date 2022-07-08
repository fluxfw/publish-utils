ARG FLUX_AUTOLOAD_API_IMAGE
ARG FLUX_NAMESPACE_CHANGER_IMAGE=docker-registry.fluxpublisher.ch/flux-namespace-changer
ARG FLUX_REST_API_IMAGE

FROM $FLUX_AUTOLOAD_API_IMAGE:v2022-06-22-1 AS flux_autoload_api
FROM $FLUX_REST_API_IMAGE:v2022-06-29-2 AS flux_rest_api

FROM $FLUX_NAMESPACE_CHANGER_IMAGE:v2022-06-23-1 AS build_namespaces

COPY --from=flux_autoload_api /flux-autoload-api /code/flux-autoload-api
RUN change-namespace /code/flux-autoload-api FluxAutoloadApi FluxPublishUtils\\Libs\\FluxAutoloadApi

COPY --from=flux_rest_api /flux-rest-api /code/flux-rest-api
RUN change-namespace /code/flux-rest-api FluxRestApi FluxPublishUtils\\Libs\\FluxRestApi

FROM alpine:latest AS build

COPY --from=build_namespaces /code/flux-autoload-api /build/flux-publish-utils/libs/flux-autoload-api
COPY --from=build_namespaces /code/flux-rest-api /build/flux-publish-utils/libs/flux-rest-api
COPY . /build/flux-publish-utils

RUN (cd /build && tar -czf flux-publish-utils.tar.gz flux-publish-utils)

FROM php:8.1-cli-alpine

LABEL org.opencontainers.image.source="https://github.com/flux-caps/flux-publish-utils"
LABEL maintainer="fluxlabs <support@fluxlabs.ch> (https://fluxlabs.ch)"

RUN ln -s /flux-publish-utils/bin/publish-utils.php /usr/bin/publish-utils
RUN ln -s /flux-publish-utils/bin/upload-release-asset.php /usr/bin/upload-release-asset

USER www-data:www-data

ENTRYPOINT []

COPY --from=build /build /

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
