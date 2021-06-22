FROM php:8.0-alpine AS build

WORKDIR /src

COPY . .

RUN chmod +x bin/build.php
RUN bin/build.php
RUN cp -r build /build
WORKDIR /build
RUN rm -rf /src

FROM nginx:1.20-alpine

LABEL org.opencontainers.image.source="https://github.com/fluxapps/FluxPublishUtils"
LABEL maintainer="fluxlabs <support@fluxlabs.ch> (https://fluxlabs.ch)"

RUN unlink /etc/nginx/conf.d/default.conf

ENV FLUX_NGINX_WEB_DIR /var/www/html

#ENV FLUX_NGINX_HTTPS_CERT
#ENV FLUX_NGINX_HTTPS_KEY
#ENV FLUX_NGINX_HTTPS_DHPARAM

ENV FLUX_NGINX_HTTP_PORT 80
ENV FLUX_NGINX_HTTPS_PORT 443

ENV FLUX_NGINX_LISTEN 0.0.0.0

EXPOSE $FLUX_NGINX_HTTP_PORT
EXPOSE $FLUX_NGINX_HTTPS_PORT

WORKDIR $FLUX_NGINX_WEB_DIR

COPY --from=build /build $FLUX_NGINX_WEB_DIR

COPY ./bin/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

