FROM alpine:3.19 AS build

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs

COPY install-libraries.sh /build/install-libraries.sh
RUN /build/install-libraries.sh

COPY . /build

RUN /build/build.mjs "--application-id=%APPLICATION_ID%"

FROM alpine:3.19

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs

ENTRYPOINT ["%APPLICATION_ID%-update-release-version"]

COPY --from=build /build/build /
