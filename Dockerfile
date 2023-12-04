FROM alpine:3.18 AS base

RUN apk upgrade --no-cache

RUN apk add --no-cache nodejs-current

RUN addgroup -S -g 1000 node && adduser -S -u 1000 -D -G node node

FROM base AS build

RUN apk add --no-cache npm

COPY bin/install-libraries.sh /build/opt/_/flux-publish-utils/bin/install-libraries.sh
RUN /build/opt/_/flux-publish-utils/bin/install-libraries.sh

COPY . /build/opt/_/flux-publish-utils

RUN mkdir -p /build/usr/local/bin && (cd /build/opt/_/flux-publish-utils/bin/PATH && for bin in *; do ln -s "../../../opt/flux-publish-utils/bin/$(basename "`readlink "$bin"`")" "/build/usr/local/bin/$bin"; done)

RUN /build/opt/_/flux-publish-utils/bin/build.mjs prod && mv /build/opt/_/flux-publish-utils /build/opt/flux-publish-utils && mv /build/opt/_/node_modules /build/opt/flux-publish-utils/node_modules && rmdir /build/opt/_

FROM base

USER node:node

ENTRYPOINT ["update-release-version"]

COPY --from=build /build /
