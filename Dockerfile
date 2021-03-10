FROM php:7.4-alpine AS build

COPY . /src
WORKDIR /src

COPY --from=composer:1.10 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev
RUN unlink /usr/bin/composer

RUN cp -r build /build
WORKDIR /build
RUN rm -rf /src

FROM httpd:2.4-alpine

RUN rm -rf /usr/local/apache2/htdocs
COPY --from=build /build /usr/local/apache2/htdocs
RUN touch /usr/local/apache2/htdocs/index.html
