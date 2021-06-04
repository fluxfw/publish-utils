#!/bin/sh
set -e

echo "Generate nginx config"
if [ -n "$FLUX_NGINX_HTTPS_CERT" ]; then
  if [ "$FLUX_NGINX_HTTPS_PORT" != "443" ]; then
    https_redirect_port=:$FLUX_NGINX_HTTPS_PORT
  fi
  if [ -n "$FLUX_NGINX_HTTPS_DHPARAM" ]; then
    ssl_dhparam="
	ssl_dhparam $FLUX_NGINX_HTTPS_DHPARAM;"
  fi
  listen="listen $FLUX_NGINX_LISTEN:$FLUX_NGINX_HTTP_PORT;
  return 301 https://\$host$https_redirect_port\$request_uri;
}

server {
  listen $FLUX_NGINX_LISTEN:$FLUX_NGINX_HTTPS_PORT ssl;
	ssl_certificate $FLUX_NGINX_HTTPS_CERT;
	ssl_certificate_key $FLUX_NGINX_HTTPS_KEY;$ssl_dhparam"
else
  listen="listen $FLUX_NGINX_LISTEN:$FLUX_NGINX_HTTP_PORT;"
fi
echo "server_tokens off;

types {
	text/plain	yml;
}

server {
	index index.html;

	$listen

	root $FLUX_NGINX_WEB_DIR/;
}" > /etc/nginx/conf.d/nginx.conf

echo "Start nginx"
exec /docker-entrypoint.sh nginx -g "daemon off;"
