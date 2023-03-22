/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
    growl: inject('growl'),
    beforeModel() {
        this._super(...arguments);
        window.loading.showLoading();
    },
    model(params) {
        let folder_id = this.modelFor("folders.folder").folder.id;
        let result = {
            password: this.store.findRecord('password', params.password_id),
            folder: this.store.peekRecord('folder', folder_id),
            passwordId: params.password_id,
            isPasswordVisible: false,
            isEdit: false,
        };
        // Check user vier_logs permission
        let canViewLogs = this.controllerFor('folders.folder.passwords.password').get('canViewLogs');

        return RSVP.hash(result).then((hash) => {
            // Load password's logs
            if (canViewLogs) {
                hash.logs = this.store.query('log', { passwordId: params.password_id, page: 1 });
                return RSVP.hash(hash).then((hashHash) => {
                    hashHash.page = hashHash.logs.get('meta')._page;
                    hashHash.pageCount = hashHash.logs.get('meta')._page_count;
                    return hashHash;
                });
            } else {
                return hash;
            }
        }).catch((adapterError) => {
            this.growl.errorShowRaw(adapterError.title, adapterError.message);
            return this.transitionTo('sorry-page');
        });
    },
    afterModel(model) {
        this._super(...arguments);

        if (model.folder.id != model.password.folder_id) {
            this.replaceWith('folders.folder.passwords.password', model.password.folder_id, model.password.id)
        }

        window.loading.hideLoading();
    },

    setupController(controller, model) {
        // Call _super for default behavior
        this._super(controller, model);
        // Implement your custom setup after
        this.controllerFor('folders.folder.passwords.password').set('updatingPasswordErrors', null);
        this.controllerFor('folders.folder.passwords.password').set('logs', model.logs);
        this.controllerFor('folders.folder.passwords.password').set('page', model.page);
        this.controllerFor('folders.folder.passwords.password').set('pageCount', model.pageCount);
        this.controllerFor('folders.folder.passwords.password').set('flag', true);

        // Descrypt/Encrypt password related variables
        if (!model.password.frontendCrypted) {
            this.controllerFor('folders.folder.passwords.password').set('passwordDecrypted', model.password.password);
        }
        this.controllerFor('folders.folder.passwords.password').set('pinDecrypt', null);
        this.controllerFor('folders.folder.passwords.password').set('isPinValid', false);
        this.controllerFor('folders.folder.passwords.password').set('passwordDescryptionFailureCounted', 0);
        this.controllerFor('folders.folder.passwords.password').set('passwordDescryptionBlocked', false);

        // Hide passwords list on Password selecting
        this.controllerFor('folders.folder').send('hidePasswordsList');
    },

    actions: {
        willTransition: function () {
            this.currentModel.password.rollbackAttributes();
        },
    },
});



