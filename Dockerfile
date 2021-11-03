FROM php:cli-alpine

LABEL org.opencontainers.image.source="https://github.com/fluxapps/FluxPublishUtils"
LABEL maintainer="fluxlabs <support@fluxlabs.ch> (https://fluxlabs.ch)"

COPY --from=docker-registry.fluxpublisher.ch/flux-autoload/api:latest /FluxAutoloadApi /FluxPublishUtils/libs/FluxAutoloadApi
COPY . /FluxPublishUtils

ENTRYPOINT ["/FluxPublishUtils/bin/entrypoint.php"]
