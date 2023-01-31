FROM php:8.2-cli-alpine AS build

COPY bin/install-libraries.sh /build/flux-publish-utils/libs/flux-publish-utils/bin/install-libraries.sh
RUN /build/flux-publish-utils/libs/flux-publish-utils/bin/install-libraries.sh

RUN ln -s libs/flux-publish-utils/bin /build/flux-publish-utils/bin

COPY . /build/flux-publish-utils/libs/flux-publish-utils

FROM php:8.2-cli-alpine

RUN ln -s /flux-publish-utils/bin/publish-utils.php /usr/bin/publish-utils
RUN ln -s /flux-publish-utils/bin/upload-release-asset.php /usr/bin/upload-release-asset

USER www-data:www-data

ENTRYPOINT []

COPY --from=build /build /
