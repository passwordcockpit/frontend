FROM php:7.2-apache

# passwordcockpit variables
# for the image
ARG PASSWORDCOCKPIT_FRONTEND_DEVELOPMENTMODE
ARG PASSWORDCOCKPIT_FRONTEND_VERSION
# for the container
ENV PASSWORDCOCKPIT_FRONTEND_BASEHOST http://127.0.0.1:8080

# apache configurations
ENV APACHE_LOG_DIR /var/log/apache2/

# install
COPY getsource.sh /usr/local/bin/

RUN set -ex; \
    \
    apt-get update; \
    \
    # install permanent application
    apt-get install -y --no-install-recommends \
    git \
    ssl-cert \
    gnupg2 \
    ; \
    \
    # install nodejs LTS and npm
    curl -sL https://deb.nodesource.com/setup_8.x | bash -; \
    apt-get install -y nodejs; \
    \
    # install apache modules
    a2enmod ssl; \
    \
    # enable HTTPS in apache (need ssl-cert and apache module ssl)
    ln -s /etc/apache2/sites-available/default-ssl.conf /etc/apache2/sites-enabled/default-ssl.conf; \
    # download source password-cockpit
    /usr/local/bin/getsource.sh $PASSWORDCOCKPIT_FRONTEND_DEVELOPMENTMODE $PASSWORDCOCKPIT_FRONTEND_VERSION

VOLUME /var/www/html
WORKDIR /var/www/html

COPY entrypoint.sh /usr/local/bin/
ENTRYPOINT ["entrypoint.sh"]

CMD ["apache2-foreground"]