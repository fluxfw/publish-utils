FROM php:8.2-cli-alpine AS build

RUN (mkdir -p /build/flux-publish-utils/libs/flux-rest-api && cd /build/flux-publish-utils/libs/flux-rest-api && wget -O - https://github.com/fluxfw/flux-rest-api/archive/refs/tags/v2023-01-30-1.tar.gz | tar -xz --strip-components=1)

COPY . /build/flux-publish-utils

FROM php:8.2-cli-alpine

RUN ln -s /flux-publish-utils/bin/publish-utils.php /usr/bin/publish-utils
RUN ln -s /flux-publish-utils/bin/upload-release-asset.php /usr/bin/upload-release-asset

USER www-data:www-data

ENTRYPOINT []

COPY --from=build /build /

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
