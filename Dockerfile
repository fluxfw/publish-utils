FROM alpine:3.19 AS build

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs

COPY bin/install-libraries.sh /build/flux-publish-utils/bin/install-libraries.sh
RUN /build/flux-publish-utils/bin/install-libraries.sh

COPY . /build/flux-publish-utils

RUN /build/flux-publish-utils/bin/build.mjs

FROM alpine:3.19

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs

ENTRYPOINT ["update-release-version"]

COPY --from=build /build/flux-publish-utils/build /
