FROM php:7.4-alpine AS build

COPY . /src
WORKDIR /src

RUN curl -sS https://getcomposer.org/installer | php -- --version=1.10.19 --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev
RUN unlink /usr/local/bin/composer

RUN cp -r build /build
WORKDIR /build
RUN rm -rf /src

FROM httpd:2.4-alpine

RUN rm -rf /usr/local/apache2/htdocs
COPY --from=build /build /usr/local/apache2/htdocs
RUN touch /usr/local/apache2/htdocs/index.html
