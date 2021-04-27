FROM php:7.4-alpine AS build

WORKDIR /src

COPY . .

RUN chmod +x bin/build.php
RUN bin/build.php
RUN cp -r build /build
WORKDIR /build
RUN rm -rf /src

FROM httpd:2.4-alpine

RUN rm -rf /usr/local/apache2/htdocs
COPY --from=build /build /usr/local/apache2/htdocs
RUN touch /usr/local/apache2/htdocs/index.html
