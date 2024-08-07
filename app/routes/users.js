/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import Object from '@ember/object';
import { inject } from '@ember/service';

export default Route.extend( {
    account: inject('account'),
    growl: inject('growl'),
    store: inject('store'),
    router: inject('router'),
    session: inject('session'),
    beforeModel(transition) {
        this.session.requireAuthentication(transition, 'login');
        this._super(...arguments);
        window.loading.showLoading(false);
    },
    model() {
        //User can access to this route only with manage_users permission
        if (this.store.peekRecord('permission', this.account.getUserId()).get('manage_users')) {
            return this.store.query('user', {}).then(
                (results) => {
                    return Object.create({
                        users: results,
                        isDetailEdit: false,
                        isPermissionEdit: false
                    });
                }
            )
                .catch((adapterError) => {
                    this.growl.errorShowRaw(adapterError.title, adapterError.message);
                    return this.router.transitionTo('sorry-page');
                });
        }
        else {
            return this.router.transitionTo('sorry-page');
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
        this.controllerFor('users').set('users', model.users);
    },
});