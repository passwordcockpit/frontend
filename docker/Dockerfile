FROM danlynn/ember-cli:3.13.0-node_10.16
# passwordcockpit variables
ENV PASSWORDCOCKPIT_BACKEND_BASEHOST http://127.0.0.1:8080

# clone the source of the frontend
RUN set -ex; \
mkdir /myapp/passwordcockpit; \
cd /myapp/passwordcockpit; \
git clone -v git://github.com/passwordcockpit/frontend.git /myapp/passwordcockpit; \
git checkout develop; \
git pull origin develop

WORKDIR /myapp/passwordcockpit

#COPY entrypoint.sh /usr/local/bin/
#ENTRYPOINT ["entrypoint.sh"]