/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

'use strict';
const local = require('./local.js');
const passwordForm = require('./password-form.js');
module.exports = function (environment) {
    let ENV = {
        tinyMCE: {
            load: 'assets'
        },
        
        modulePrefix: 'passwordcockpit_frontend',
        environment,
        rootURL: '/',
        locationType: 'auto',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            },
            EXTEND_PROTOTYPES: {
                // Prevent Ember Data from overriding Date.parse.
                Date: false
            }
        },

        APP: {
            host: local.baseHost,
            namespace: 'api/v1',
            languages: ['en', 'it']
        },
        passwordFormConfig: passwordForm.passwordFormConfig

    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
        ENV.APP.autoboot = false;
    }

    if (environment === 'production') {
        // here you can enable a production-specific feature
    }

    if (environment === 'development') {
    }

    // Authentication parameters
    ENV['ember-simple-auth'] = {
        store: 'simple-auth-session-store:session-storage',
        authorizer: 'authorizer:token',
        routeAfterAuthentication: 'folders',
    };

    ENV['ember-simple-auth-token'] = {
        tokenPropertyName: 'token',
        authorizationPrefix: 'Bearer ',
        authorizationHeaderName: 'Authorization',
        tokenExpireName: 'exp',
        serverTokenEndpoint: local.baseHost + '/api/auth',

        refreshAccessTokens: true,
        refreshTokenPropertyName: 'token',
        serverTokenRefreshEndpoint: local.baseHost + '/api/auth/update', // Server endpoint to send refresh request
        refreshLeeway: 900 // Amount of time (sec.) to send refresh request before token expiration
    };

    return ENV;
};
