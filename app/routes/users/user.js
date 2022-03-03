/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
    account: inject('account'),

    beforeModel() {
        this._super(...arguments);
        window.loading.showLoading();
    },
    model(params) {
        let user = this.store.peekRecord('user', params.user_id);

        //Check that user exists
        if (user) {
            let result = {
                user: user,
                permission: this.store.queryRecord('permission', { userId: params.user_id })
            };
            let canViewLog = this.store.peekRecord('permission', this.account.getUserId()).get('view_logs');
            // Load logs data
            result.logs = {};
            if (canViewLog) {
                result.logs = this.store.query('userlog', { userId: params.user_id, page: 1 });
            }
            return RSVP.hash(result).then((hash) => {
                if (canViewLog) {
                    hash.page = hash.logs.get('meta')._page;
                    hash.pageCount = hash.logs.get('meta')._page_count;
                }
                hash.userId = params.user_id;
                hash.canViewLog = canViewLog;
                return hash;
            });
        }
        else {
            return this.transitionTo('sorry-page');
        }
    },
    afterModel() {
        this._super(...arguments);
        window.loading.hideLoading();
    },

    setupController(controller, model) {
        // Call _super for default behavior
        this._super(controller, model);
        // Implement your custom setup after
        this.controllerFor('users.user').set('canViewLog', model.canViewLog);
        this.controllerFor('users.user').set('logs', model.logs);
        this.controllerFor('users.user').set('updatingUserErrors', null);
    },

    actions: {
        willTransition: function () {
            this.currentModel.user.rollbackAttributes();
            this.currentModel.permission.rollbackAttributes();
        }
    },
});