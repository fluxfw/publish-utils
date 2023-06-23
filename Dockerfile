FROM node:20-alpine AS build

COPY bin/install-libraries.sh /build/flux-publish-utils/libs/flux-publish-utils/bin/install-libraries.sh
RUN /build/flux-publish-utils/libs/flux-publish-utils/bin/install-libraries.sh

RUN ln -s libs/flux-publish-utils/bin /build/flux-publish-utils/bin

COPY . /build/flux-publish-utils/libs/flux-publish-utils

RUN /build/flux-publish-utils/libs/flux-publish-utils/bin/build.mjs prod

RUN mkdir -p /build/flux-publish-utils/.local/bin && for bin in /build/flux-publish-utils/bin/*.mjs; do ln -s "../../bin/`basename "$bin"`" "/build/flux-publish-utils/.local/bin/`basename "${bin%.*}"`"; done

FROM node:20-alpine

ENV PATH "/flux-publish-utils/.local/bin:$PATH"

USER node:node

ENTRYPOINT []

COPY --from=build /build /
