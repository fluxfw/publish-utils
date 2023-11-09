FROM node:20-alpine AS build

COPY bin/install-libraries.sh /build/opt/flux-publish-utils/libs/flux-publish-utils/bin/install-libraries.sh
RUN /build/opt/flux-publish-utils/libs/flux-publish-utils/bin/install-libraries.sh

RUN ln -s libs/flux-publish-utils/bin /build/opt/flux-publish-utils/bin
RUN ln -s libs/flux-publish-utils/src /build/opt/flux-publish-utils/src

COPY . /build/opt/flux-publish-utils/libs/flux-publish-utils

RUN /build/opt/flux-publish-utils/bin/build.mjs prod

RUN mkdir -p /build/usr/local/bin && (cd /build/opt/flux-publish-utils/bin/PATH && for bin in *; do ln -s "../../../opt/flux-publish-utils/bin/PATH/$bin" "/build/usr/local/bin/$bin"; done)

FROM node:20-alpine

USER node:node

ENTRYPOINT ["update-release-version"]

COPY --from=build /build /
