/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller, { inject as controller } from '@ember/controller';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({
    session: inject('session'),
    growl: inject('growl'),
    foldersController: controller('folders'),
    folderController: controller('folders.folder'),
    showList: true,
    actions: {

        removePassword(passwordId) {
            let newPass = [];
            this.get('passwords').forEach((el) => {
                if (el.password_id != passwordId) {
                    newPass.push(el);
                }
            });
            this.set('passwords', newPass);
        },

        /**
         * Load selected folder's passwords data
         * Is called by folder (route) on generating folder model data
         * 
         * @param {*} params 
         */
        onSelectFolder(params) {
            window.loading.showLoading();
            let folderId = params.folderId;
            let path = params.folderPath;
            this.set('folderId', folderId);

            $.ajax({
                url: window.APP.host + '/' + window.APP.namespace + '/folders/' + folderId + '/passwords',
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": "application/json",
                    "Authorization": "Bearer " + this.get('session.data.authenticated.token')
                }
            }).done((result) => {
                this.set('passwords', result._embedded.passwords);
                this.set('selectFolder', true);
                // Hide folders list on Folder selecting // mobile only
                this.get('foldersController').send('hideFoldersList');
                // show passwords list on Folder selecting // mobile only
                this.get('folderController').send('showPasswordsList');
                // Opens the related folders of the selected folder
                for (let i = 0; i < path.length; i++) {
                    this.get('foldersController').send('slideDown', path[i]);
                }

                window.loading.hideLoading();
            }).fail((adapterError) => {
                this.set('passwords', null);
                this.set('selectFolder', false);
                window.loading.hideLoading();
                this.get('growl').errorShowRaw(adapterError.responseJSON.title, adapterError.responseJSON.detail);
            });

        },
        /**
         * Update the passwords list of the current folder
         * Is called by new-password/password (controller) on updating/creating new password
         */
        onUpdatePassword() {
            window.loading.showLoading();

            $.ajax({
                url: window.APP.host + '/' + window.APP.namespace + '/folders/' + this.get('folderId') + '/passwords',
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": "application/json",
                    "Authorization": "Bearer " + this.get('session.data.authenticated.token')
                }
            }).done((result) => {
                this.set('passwords', result._embedded.passwords);
                this.set('selectFolder', true);
                window.loading.hideLoading();
            }).fail((adapterError) => {
                this.set('passwords', null);
                window.loading.hideLoading();
                this.get('growl').errorShowRaw(adapterError.responseJSON.title, adapterError.responseJSON.detail);
            });
        },
        /**
         * Toggle passwords list visibility (only for mobile)
         */
        showPasswordsList() {
            this.set('showList', true);
        },
        hidePasswordsList() {
            this.set('showList', false);
        },
    }
});
