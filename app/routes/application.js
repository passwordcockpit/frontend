/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

// app/routes/application.js
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import jwtDecode from 'ember-cli-jwt-decode';
import ENV from '../config/environment';
import RSVP from 'rsvp';

export default Route.extend(ApplicationRouteMixin, {
    session: inject('session'),
    account: inject('account'),
    growl: inject('growl'),
    intl: inject('intl'),
    loading: inject('loading'),
    closeFoldersInputs: inject('close-folders-inputs'),
    store: inject('store'),
    router: inject('router'),
   async beforeModel() {
    await this.session.setup();
        this._super(...arguments);
        window.loading = this.loading;
        window.loading.showLoading(false);
        this.set('intl.locale', ENV.APP.languages);
    },
    model() {
        let self = this;
        let session = this.session;
        if (session.get('isAuthenticated')) {
            this.closeFoldersInputs.init(this);
            var userID = jwtDecode(this.get('session.session.content.authenticated.token'));

            let result = {
                user: this.store.findRecord('user', userID.sub),
            };

            if (userID.data.change_password) {
                this.router.transitionTo('profile');
            } else {
                result.permission = this.store.queryRecord('permission', { userId: userID.sub });
            }
            return RSVP.hash(result).then((hash) => {
                self.get('account').setUser(hash.user);
                //Set language
                var token = jwtDecode(this.get('session.data.authenticated.token'));
                this.set('intl.locale', token.data.language);
                return {
                    user: hash.user,
                    permission: hash.permission,
                    userId: userID.sub,
                    isLdap: token.data.ldap
                };
            }).catch((adapterError) => {
                if (adapterError.hasOwnProperty('code')) {
                    if (adapterError.code == 401) {
                        self.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                        self.get('session').invalidate();
                    }
                }
            });
        }
    },
    afterModel() {
        this._super(...arguments);
        window.loading.hideLoading();
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
        this.router.transitionTo('folders');
    }
});