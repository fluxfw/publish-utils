FROM alpine:3.20 AS build

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs npm

COPY install-libraries.sh "/build/%APPLICATION_ID%/install-libraries.sh"
%INSTALL_LIBRARIES%
COPY package.json "/build/%APPLICATION_ID%/package.json"
COPY package-lock.json "/build/%APPLICATION_ID%/package-lock.json"
RUN "/build/%APPLICATION_ID%/install-libraries.sh"

COPY . "/build/%APPLICATION_ID%"

RUN "/build/%APPLICATION_ID%/build.mjs"

FROM alpine:3.20

RUN apk upgrade --no-cache && \
    apk add --no-cache nodejs

ENTRYPOINT ["%APPLICATION_ID%-update-release-version"]

COPY --from=build "/build/%APPLICATION_ID%/build" /
