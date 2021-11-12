ARG REST_BASE_API_IMAGE
FROM $REST_BASE_API_IMAGE AS rest_base_api

FROM php:cli-alpine

LABEL org.opencontainers.image.source="https://github.com/fluxapps/FluxPublishUtils"
LABEL maintainer="fluxlabs <support@fluxlabs.ch> (https://fluxlabs.ch)"

COPY --from=rest_base_api /FluxRestBaseApi /FluxPublishUtils/libs/FluxRestBaseApi
COPY . /FluxPublishUtils

ENTRYPOINT ["/FluxPublishUtils/bin/entrypoint.php"]
