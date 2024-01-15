FROM alpine:3.19 AS base

RUN apk upgrade --no-cache

RUN apk add --no-cache nodejs

RUN addgroup -S -g 1000 node && adduser -S -u 1000 -D -G node node

FROM base AS build

COPY bin/install-libraries.sh /build/flux-publish-utils/bin/install-libraries.sh
RUN /build/flux-publish-utils/bin/install-libraries.sh

COPY . /build/flux-publish-utils

RUN /build/flux-publish-utils/bin/build.mjs

FROM base

USER node:node

ENTRYPOINT ["update-release-version"]

COPY --from=build /build/flux-publish-utils/build /
