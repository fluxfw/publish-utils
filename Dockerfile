FROM php:cli-alpine

LABEL org.opencontainers.image.source="https://github.com/fluxapps/FluxPublishUtils"
LABEL maintainer="fluxlabs <support@fluxlabs.ch> (https://fluxlabs.ch)"

COPY --from=docker-registry.fluxpublisher.ch/flux-rest/base-api:latest /FluxRestBaseApi /FluxPublishUtils/libs/FluxRestBaseApi
COPY . /FluxPublishUtils

ENTRYPOINT ["/FluxPublishUtils/bin/entrypoint.php"]
