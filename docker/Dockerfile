FROM danlynn/ember-cli:3.13.0-node_10.16
# passwordcockpit variables
ENV PASSWORDCOCKPIT_BASEHOST https://[YOUR-IP]:4344

# clone the source of the frontend
RUN set -ex; \
mkdir /myapp/passwordcockpit; \
cd /myapp/passwordcockpit; \
git clone -v git://github.com/passwordcockpit/frontend.git /myapp/passwordcockpit; \
git checkout develop; \
git pull origin develop

WORKDIR /myapp/passwordcockpit

RUN npm install

# fix timezone
RUN rm -rf /etc/localtime \
 && ln -s /usr/share/zoneinfo/Europe/Berlin /etc/localtime

VOLUME /var/www/html
WORKDIR /var/www/html

COPY entrypoint.sh /usr/local/bin/
ENTRYPOINT ["entrypoint.sh"]