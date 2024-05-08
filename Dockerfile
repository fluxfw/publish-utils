FROM alpine:3.19 AS build

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs

COPY bin/install-libraries.sh /build/publish-utils/bin/install-libraries.sh
RUN /build/publish-utils/bin/install-libraries.sh

COPY . /build/publish-utils

RUN /build/publish-utils/bin/build.mjs

FROM alpine:3.19

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs

ENTRYPOINT ["update-release-version"]

COPY --from=build /build/publish-utils/build /
