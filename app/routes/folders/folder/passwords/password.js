/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import $ from 'jquery';

export default Route.extend(AuthenticatedRouteMixin, {

    growl: inject('growl'),

    beforeModel() {
        this._super(...arguments);
        $('#loading').show();
    },
    model(params, transition) {
        let result = {
            password: this.get('store').findRecord('password', params.password_id),
            folder: this.get('store').peekRecord('folder', transition.params['folders.folder'].folder_id),
            passwordId: params.password_id,
            isPasswordVisible: false,
            isEdit: false,
        };
        // Check user vier_logs permission
        let canViewLogs = this.controllerFor('folders.folder.passwords.password').get('canViewLogs');

        let self = this;

        return RSVP.hash(result).then((hash) => {
            // Load password's logs
            if (canViewLogs) {
                hash.logs = this.get('store').query('log', { passwordId: params.password_id, page: 1 });
                return RSVP.hash(hash).then((hashHash) => {
                    hashHash.page = hashHash.logs.get('meta')._page;
                    hashHash.pageCount = hashHash.logs.get('meta')._page_count;
                    hashHash.logs.forEach(function (log) {
                        log.set('userName', self.get('store').peekRecord('user', log.get('user_id')).get('username'));
                    });
                    return hashHash;
                });
            } else {
                return hash;
            }
        }).catch((adapterError) => {
            this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
            return this.transitionTo('sorry-page');
        });
    },
    afterModel() {
        this._super(...arguments);
        $('#loading').hide();
    },

    setupController(controller, model) {
        // Call _super for default behavior
        this._super(controller, model);
        // Implement your custom setup after
        this.controllerFor('folders.folder.passwords.password').set('updatingPasswordErrors', null);
        this.controllerFor('folders.folder.passwords.password').set('logs', model.logs);
        this.controllerFor('folders.folder.passwords.password').set('page', model.page);
        this.controllerFor('folders.folder.passwords.password').set('pageCount', model.pageCount);
        
        // Hide passwords list on Password selecting
        this.controllerFor('folders.folder').send('hidePasswordsList');
    },
});



