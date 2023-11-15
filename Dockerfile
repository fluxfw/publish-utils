FROM alpine:3.18 AS base

RUN apk upgrade --no-cache

RUN apk add --no-cache nodejs-current

RUN addgroup -S -g 1000 node && adduser -S -u 1000 -D -G node node

FROM base AS build

COPY bin/install-libraries.sh /build/opt/flux-publish-utils/libs/flux-publish-utils/bin/install-libraries.sh
RUN /build/opt/flux-publish-utils/libs/flux-publish-utils/bin/install-libraries.sh

RUN ln -s libs/flux-publish-utils/bin /build/opt/flux-publish-utils/bin
RUN ln -s libs/flux-publish-utils/src /build/opt/flux-publish-utils/src

COPY . /build/opt/flux-publish-utils/libs/flux-publish-utils

RUN /build/opt/flux-publish-utils/bin/build.mjs prod

RUN mkdir -p /build/usr/local/bin && (cd /build/opt/flux-publish-utils/bin/PATH && for bin in *; do ln -s "../../../opt/flux-publish-utils/bin/PATH/$bin" "/build/usr/local/bin/$bin"; done)

FROM base

USER node:node

ENTRYPOINT ["update-release-version"]

COPY --from=build /build /
