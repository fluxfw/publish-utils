FROM php:7.4-alpine AS build

WORKDIR /src

COPY . .

RUN chmod +x bin/build.php
RUN bin/build.php
RUN cp -r build /build
WORKDIR /build
RUN rm -rf /src

FROM nginx:1.19-alpine

RUN rm -rf /usr/share/nginx/html
COPY --from=build /build /usr/share/nginx/html
RUN touch /usr/share/nginx/html/index.html
