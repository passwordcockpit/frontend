FROM danlynn/ember-cli:3.28.2-node_14.18
# passwordcockpit variables
ENV PASSWORDCOCKPIT_BASEHOST https://[YOUR-IP]:4344

# clone the source of the frontend
RUN set -ex; \
mkdir /myapp/passwordcockpit; \
cd /myapp/passwordcockpit; \
git clone -v git://github.com/passwordcockpit/frontend.git /myapp/passwordcockpit; \
git checkout 1.2.0.dev; \
git pull origin 1.2.0.dev

WORKDIR /myapp/passwordcockpit

RUN npm install

# fix timezone
RUN rm -rf /etc/localtime \
 && ln -s /usr/share/zoneinfo/Europe/Berlin /etc/localtime

VOLUME /var/www/html
WORKDIR /var/www/html

COPY entrypoint.sh /usr/local/bin/
ENTRYPOINT ["entrypoint.sh"]