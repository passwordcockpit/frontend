/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import jwtDecode from 'ember-cli-jwt-decode';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';
import { inject } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
    session: inject('session'),
    store: inject('store'),
    router: inject('router'),
    beforeModel() {
        this._super(...arguments);
        window.loading.showLoading(false);
    },
    model() {
        let isLdap = jwtDecode(this.get('session.data.authenticated.token')).data.ldap;

        let logedUserId = jwtDecode(this.get('session.data.authenticated.token')).sub;

        // If is ldap, user cannot change password
        if (isLdap) {
            return this.router.transitionTo('sorry-page');
        }

        let result = {
            user: this.store.findRecord('user', logedUserId),
            isDetailEdit: false,
        };
        return RSVP.hash(result).then((hash) => {
            return hash
        }).catch(() => {
            this.growl.error('Error', 'Error while retrieving user');
        });
    },
    afterModel() {
        this._super(...arguments);
        window.loading.hideLoading();
    },

    actions: {
        willTransition: function (transition) {
            this.currentModel.user.rollbackAttributes();
            if (this.get('session.data.authenticated.tokenData.data.change_password')) {
                transition.abort();
            }else{
                return true;
            }
        }
    },
});