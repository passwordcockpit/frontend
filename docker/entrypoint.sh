#!/bin/bash

# check volume
count=$(ls -f | wc -l)

# remove .DS_Store if is the only file
if [ $count -eq "3" ] && [ -a .DS_Store ]; then
    rm -rf .DS_Store
    echo >&2 ".DS_Store removed from $PWD"
    count=$((count - 1))
fi

# install passwordcockpit only if the volume is empty
if  [ $count -gt "2" ]; then
        echo >&2 "WARNING: $PWD is not empty! Passwordcockpit will not be installed"
else
    # move passwordcockpit source in container
    shopt -s dotglob
    mv /usr/src/passwordcockpit/* ./
    echo >&2 "Source moved in $PWD"

    if [ "${PASSWORDCOCKPIT_FRONTEND_DEVELOPMENTMODE_FOR_ENTRYPOINT}" -eq "1" ]; then
        # npm install
        npm install
        # install ember-cli global
        npm install -g ember-cli
        # develop mode
        sed -ri -e 's!PASSWORDCOCKPIT_FRONTEND_BASEHOST_TOKEN!'${PASSWORDCOCKPIT_FRONTEND_BASEHOST}'!g' config/local.js
        echo >&2 "local.js updated"
    else
        # production mode
        sed -ri -e 's!PASSWORDCOCKPIT_FRONTEND_BASEHOST_TOKEN!'${PASSWORDCOCKPIT_FRONTEND_BASEHOST}'!g' index.html
        sed -ri -e 's!PASSWORDCOCKPIT_FRONTEND_BASEHOST_TOKEN!'${PASSWORDCOCKPIT_FRONTEND_BASEHOST}'!g' assets/*.*
        echo >&2 "files updated"
    fi
fi

exec "$@"