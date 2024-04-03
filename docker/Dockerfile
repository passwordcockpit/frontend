FROM node:18.3

# passwordcockpit variables
ENV PASSWORDCOCKPIT_BASEHOST https://[YOUR-IP]:4344

# clone the source of the frontend
RUN set -ex; \
mkdir -p /myapp/passwordcockpit; \
cd /myapp/passwordcockpit; \
git clone -v https://github.com/passwordcockpit/frontend.git /myapp/passwordcockpit; \
git checkout 1.4.0.dev; \
git pull origin 1.4.0.dev

WORKDIR /myapp/passwordcockpit

RUN npm install

# fix timezone
RUN rm -rf /etc/localtime \
 && ln -s /usr/share/zoneinfo/Europe/Berlin /etc/localtime

VOLUME /var/www/html
WORKDIR /var/www/html

COPY entrypoint.sh /usr/local/bin/
ENTRYPOINT ["entrypoint.sh"]