#!/bin/bash
# $1 = PASSWORDCOCKPIT_FRONTEND_DEVELOPMENTMODE
# $2 = PASSWORDCOCKPIT_FRONTEND_VERSION

# clone te git repository, if the folder is not empty it not work
git clone -v git://github.com/passwordcockpit/frontend.git /usr/src/passwordcockpit
cd /usr/src/passwordcockpit

if [ $1 -eq 1 ]; then
    echo >&2 "Development mode"

    git checkout develop
    git pull origin develop

else
    echo >&2 "Production mode"

    # checkout the version of the application
    git checkout $2
    
    # remove al git files
    find . -name ".git*" -exec rm -R {} \;
    # clean application
    rm -rf tests
fi

# npm install
npm install
# install ember-cli
npm install -g ember-cli
# install bower
npm install -g bower
bower install --allow-root