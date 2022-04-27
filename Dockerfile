ARG FLUX_AUTOLOAD_API_IMAGE=docker-registry.fluxpublisher.ch/flux-autoload/api
ARG FLUX_NAMESPACE_CHANGER_IMAGE=docker-registry.fluxpublisher.ch/flux-namespace-changer
ARG FLUX_REST_API_IMAGE=docker-registry.fluxpublisher.ch/flux-rest/api

FROM $FLUX_AUTOLOAD_API_IMAGE:latest AS flux_autoload_api
FROM $FLUX_NAMESPACE_CHANGER_IMAGE:latest AS flux_autoload_api_build
ENV FLUX_NAMESPACE_CHANGER_FROM_NAMESPACE FluxAutoloadApi
ENV FLUX_NAMESPACE_CHANGER_TO_NAMESPACE FluxPublishUtils\\Libs\\FluxAutoloadApi
COPY --from=flux_autoload_api /flux-autoload-api /code
RUN change-namespace

FROM $FLUX_REST_API_IMAGE:latest AS flux_rest_api
FROM $FLUX_NAMESPACE_CHANGER_IMAGE:latest AS flux_rest_api_build
ENV FLUX_NAMESPACE_CHANGER_FROM_NAMESPACE FluxRestApi
ENV FLUX_NAMESPACE_CHANGER_TO_NAMESPACE FluxPublishUtils\\Libs\\FluxRestApi
COPY --from=flux_rest_api /flux-rest-api /code
RUN change-namespace

FROM alpine:latest AS build

COPY --from=flux_autoload_api_build /code /flux-publish-utils/libs/flux-autoload-api
COPY --from=flux_rest_api_build /code /flux-publish-utils/libs/flux-rest-api
COPY . /flux-publish-utils

FROM php:8.1-cli-alpine

LABEL org.opencontainers.image.source="https://github.com/flux-caps/flux-publish-utils"
LABEL maintainer="fluxlabs <support@fluxlabs.ch> (https://fluxlabs.ch)"

USER www-data:www-data

ENTRYPOINT ["/flux-publish-utils/bin/publish-utils.php"]

COPY --from=build /flux-publish-utils /flux-publish-utils

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
