/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import jwtDecode from 'ember-cli-jwt-decode';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import $ from 'jquery';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
    beforeModel() {
        this._super(...arguments);
        $('#loading').show();
    },
    model() {
        let isLdap = jwtDecode(this.get('session.data.authenticated.token')).data.ldap;

        let logedUserId = jwtDecode(this.get('session.data.authenticated.token')).sub;

        // If is ldap, user cannot change password
        if (isLdap) {
            return this.transitionTo('sorry-page');
        }

        let result = {
            user: this.get('store').findRecord('user', logedUserId),
            isDetailEdit: false,
        };
        return RSVP.hash(result).then((hash) => {
            return hash
        }).catch(() => {
            this.get('growl').error('Error', 'Error while retrieving user');
        });
    },
    afterModel() {
        this._super(...arguments);
        $('#loading').hide();
    },

    actions: {
        willTransition: function () {
            this.currentModel.user.rollbackAttributes();
        }
    },
});