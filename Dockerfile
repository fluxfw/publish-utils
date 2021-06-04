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

ENV NGINX_WEB_DIR /var/www/html

#ENV NGINX_HTTPS_CERT
#ENV NGINX_HTTPS_KEY
#ENV NGINX_HTTPS_DHPARAM

ENV NGINX_HTTP_PORT 80
ENV NGINX_HTTPS_PORT 443

ENV NGINX_LISTEN 0.0.0.0

EXPOSE $NGINX_HTTP_PORT
EXPOSE $NGINX_HTTPS_PORT

WORKDIR $NGINX_WEB_DIR

COPY --from=build /build $NGINX_WEB_DIR

COPY ./bin/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]