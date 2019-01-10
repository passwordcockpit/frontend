/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

// app/routes/application.js
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import jwtDecode from 'ember-cli-jwt-decode';
import RSVP from 'rsvp';
import $ from 'jquery';


export default Route.extend(ApplicationRouteMixin, {
    session: inject('session'),
    account: inject('account'),
    growl: inject('growl'),
    i18n: inject('i18n'),
    closeFoldersInputs: inject('close-folders-inputs'),

    beforeModel() {
        this._super(...arguments);
        $('#loading').show();
    },
    model() {
        let self = this;
        let session = this.get('session');
        if (session.get('isAuthenticated')) {
            this.get('closeFoldersInputs').init(this);
            var userID = jwtDecode(this.get('session.session.content.authenticated.token'));
            
            let result = {
                user: this.get('store').findRecord('user', userID.sub),
                permission: this.get('store').queryRecord('permission', { userId: userID.sub })
            };
            return RSVP.hash(result).then((hash) => {
                self.get('account').setUser(hash.user);
                //Set language
                var token = jwtDecode(this.get('session.data.authenticated.token'));
                this.set('i18n.locale', token.data.language);
                return {
                    user: hash.user,
                    permission: hash.permission,
                    userId: userID.sub,
                    isLdap: token.data.ldap
                };
            }).catch((adapterError) => {
                if (adapterError.hasOwnProperty('code')) {
                    if (adapterError.code == 401) {
                        this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                        this.get('router').transitionTo('login');
                    }
                }
            });
        }
    },
    afterModel() {
        this._super(...arguments);
        $('#loading').hide();
    },

    /**
    This method handles the session's
    {{#crossLink "SessionService/authenticationSucceeded:event"}}{{/crossLink}}
    event. If there is a transition that was previously intercepted by the
    {{#crossLink "AuthenticatedRouteMixin/beforeModel:method"}}
    AuthenticatedRouteMixin's `beforeModel` method{{/crossLink}} it will retry
    it. If there is no such transition, the `ember_simple_auth-redirectTarget`
    cookie will be checked for a url that represents an attemptedTransition
    that was aborted in Fastboot mode, otherwise this action transitions to the
    {{#crossLink "Configuration/routeAfterAuthentication:property"}}{{/crossLink}}.
    @method sessionAuthenticated
    @public
    */
    sessionAuthenticated() {
        this.refresh();
        this.transitionTo('folders');
    }
});