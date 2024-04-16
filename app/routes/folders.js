/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';
import $ from 'jquery';
import { later } from '@ember/runloop'

export default Route.extend(AuthenticatedRouteMixin, {
    account: inject('account'),
    growl: inject('growl'),
    session: inject('session'),
    closeFoldersInputs: inject('close-folders-inputs'),
    transition: null,
    store: inject('store'),
    beforeModel() {
        this._super(...arguments);
        window.loading.showLoading();
    },
    model(params, transition) {
        this.transition = transition;
        this.store.unloadAll('folder');
        // Save current transition to folders
        this.controllerFor('folders').set('transitionData', transition);

        // Get all permissions and send them to specific controllers
        let canCreateFolders = this.store.peekRecord('permission', this.account.getUserId()).get('create_folders');
        this.controllerFor('folders').set('canCreateFolders', canCreateFolders);

        let canAccessAllFolders = this.store.peekRecord('permission', this.account.getUserId()).get('access_all_folders');
        this.controllerFor('folders').set('canAccessAllFolders', canAccessAllFolders);
        this.controllerFor('folders.folder.passwords.password').set('canAccessAllFolders', canAccessAllFolders);

        let canViewLogs = this.store.peekRecord('permission', this.account.getUserId()).get('view_logs');
        this.controllerFor('folders.folder.passwords.password').set('canViewLogs', canViewLogs);

        // Show folders/passwords list
        this.controllerFor('folders').send('showFoldersList');
        this.controllerFor('folders.folder').send('showPasswordsList');
        this.controllerFor('folders.index').send('showPasswordsList');

        // Clear search result
        this.controllerFor('folders').set('searchResults', null);

        // Retrieve all users for edit purposes
        // Save to store
        let self = this;
        $.ajax({
            url: window.APP.host + '/' + window.APP.namespace + '/users/usernames',
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + this.get('session.data.authenticated.token')
            }
        }).done((results) => {
            results._embedded.users.forEach(user => {
                let storeUser = self.get('store').peekRecord('user', user.user_id);
                if (storeUser == null) {
                    user.id = user.user_id;
                    self.get('store').createRecord('user', user);
                }
            });
        });

        // Return folder data as Model
        return this.store.findAll('folder', { reload: true })
            .then((results) => {
                this.controllerFor('folders').send('buildTree', { folders: results });

                // set folder.isShow for selected folder
                // if transition contains 'folders.folder' params
                if (this.modelFor("folders.folder") != undefined) {
                    let folderId = this.modelFor("folders.folder").folder.id;
                    while (folderId !== null) {
                        let folder = this.store.peekRecord('folder', folderId);
                        folder.set('isShow', true);
                        folderId = folder.parent_id;
                    }
                }

                return results;
            })
            .catch((error) => {
                this.growl.errorShowRaw(error.title, error.message);
                if (error.code == 401) {
                    later((function () {
                        self.get('session').invalidate();
                    }), 2000);
                }
            });
    },
    afterModel() {
        this._super(...arguments);
        window.loading.hideLoading();
    },
    actions: {
        willTransition: function () {
            this.closeFoldersInputs.closeAllInputs();
            this.controllerFor('folders').set('searchResults', null);
        },
    },
});