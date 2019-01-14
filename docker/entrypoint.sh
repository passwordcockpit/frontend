#!/bin/bash

# check volume
count=$(ls -f | wc -l)

# remove .DS_Store if is the only file
if [ $count -eq "3" ] && [ -a .DS_Store ]; then
    rm -rf .DS_Store
    echo >&2 ".DS_Store removed from $PWD"
elif [ $count -gt "2" ]; then
        echo >&2 "ERROR: $PWD is not empty! Passwordcockpit will not be installed"
        exit 1
fi

# move passwordcockpit source in container
shopt -s dotglob
mv /usr/src/passwordcockpit/* ./
echo >&2 "Source copied in $PWD"

# configuration files
filename=/var/www/html/config/local.js
if [ ! -e $filename ]; then
    {
        echo "module.exports = {"
        echo "    baseHost: '${PASSWORDCOCKPIT_FRONTEND_BASEHOST}'"
        echo "};"
    } >> $filename

fi
echo >&2 "Configuration files created"

exec "$@"