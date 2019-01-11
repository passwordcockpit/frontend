#!/bin/bash

# check volume
count=$(ls -f | wc -l)

# remove .DS_Store if is the only file
if [ $count -eq "3" ] && [ -a .DS_Store ]; then
    rm -rf .DS_Store
    echo >&2 ".DS_Store removed from $PWD"
elif [ $count -gt "2" ]; then
        echo >&2 "ERROR: $PWD is not empty! Passwrdcockpit will not be installed"
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

if [ "${PASSWORDCOCKPIT_BACKEND_DEVELOPMENTMODE}" -eq 1 ]; then
    # development mode
    echo >&2 "Development mode"
else
    # production mode
    # build application
    ember build -p
    # remove all file escept dist
    find . -maxdepth 1 ! -name 'dist' -exec rm -rf {} \;
    # move dist file in webroot
    mv dist/* ./
    # remove empty dist folder
    rm -rf dist
fi

exec "$@"