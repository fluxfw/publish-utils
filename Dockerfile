FROM php:8.2-cli-alpine AS build

RUN (mkdir -p /flux-namespace-changer && cd /flux-namespace-changer && wget -O - https://github.com/fluxfw/flux-namespace-changer/releases/download/v2022-07-12-1/flux-namespace-changer-v2022-07-12-1-build.tar.gz | tar -xz --strip-components=1)

RUN (mkdir -p /build/flux-publish-utils/libs/flux-autoload-api && cd /build/flux-publish-utils/libs/flux-autoload-api && wget -O - https://github.com/fluxfw/flux-autoload-api/releases/download/v2022-12-12-1/flux-autoload-api-v2022-12-12-1-build.tar.gz | tar -xz --strip-components=1 && /flux-namespace-changer/bin/change-namespace.php . FluxAutoloadApi FluxPublishUtils\\Libs\\FluxAutoloadApi)

RUN (mkdir -p /build/flux-publish-utils/libs/flux-rest-api && cd /build/flux-publish-utils/libs/flux-rest-api && wget -O - https://github.com/fluxfw/flux-rest-api/releases/download/v2022-12-12-1/flux-rest-api-v2022-12-12-1-build.tar.gz | tar -xz --strip-components=1 && /flux-namespace-changer/bin/change-namespace.php . FluxRestApi FluxPublishUtils\\Libs\\FluxRestApi)

COPY . /build/flux-publish-utils

FROM php:8.2-cli-alpine

RUN ln -s /flux-publish-utils/bin/publish-utils.php /usr/bin/publish-utils
RUN ln -s /flux-publish-utils/bin/upload-release-asset.php /usr/bin/upload-release-asset

USER www-data:www-data

ENTRYPOINT []

COPY --from=build /build /

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
