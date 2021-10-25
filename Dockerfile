FROM php:8.0-cli-alpine

LABEL org.opencontainers.image.source="https://github.com/fluxapps/FluxPublishUtils"
LABEL maintainer="fluxlabs <support@fluxlabs.ch> (https://fluxlabs.ch)"

COPY . /FluxPublishUtils

ENTRYPOINT ["/FluxPublishUtils/bin/entrypoint.php"]
