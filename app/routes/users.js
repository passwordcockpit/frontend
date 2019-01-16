/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import Object from '@ember/object';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Route.extend(AuthenticatedRouteMixin, {
    account: inject('account'),
    growl: inject('growl'),

    beforeModel() {
        this._super(...arguments);
        $('#loading').show();
    },
    model() {
        //User can access to this route only with manage_users permission
        if (this.get('store').peekRecord('permission', this.get('account').getUserId()).get('manage_users')) {
            return this.get('store').query('user', {}).then(
                (results) => {
                    return Object.create({
                        users: results,
                        isDetailEdit: false,
                        isPermissionEdit: false
                    });
                }
            )
                .catch((adapterError) => {
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                    return this.transitionTo('sorry-page');
                });
        }
        else {
            return this.transitionTo('sorry-page');
        }
    },
    afterModel() {
        this._super(...arguments);
        $('#loading').hide();
    },

    setupController(controller, model) {
        // Call _super for default behavior
        this._super(controller, model);
        // Implement your custom setup after
        this.controllerFor('users').set('users', model.users);
    },
});