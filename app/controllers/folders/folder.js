/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
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
        /**
         * Load selected folder's passwords data
         * Is called by folder (route) on generating folder model data
         * 
         * @param {*} params 
         */
        onSelectFolder(params) {
            $('#loading').show();
            let folderId = params.folderId;
            this.set('folderId', folderId);

            $.ajax({
                url: window.APP.host + '/' + window.APP.namespace + '/folders/' + folderId + '/passwords',
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": "application/json",
                    "Authorization": "Bearer " + this.get('session.data.authenticated.token')
                }
            }).then((result) => {
                this.set('passwords', result._embedded.passwords);
                this.set('selectFolder', true);
                // Hide folders list on Folder selecting
                this.get('foldersController').send('hideFoldersList');
                // show passwords list on Folder selecting
                this.get('folderController').send('showPasswordsList');

                $('#loading').hide();
            }).catch((adapterError) => {
                this.set('passwords', null);
                this.set('selectFolder', false);
                $('#loading').hide();
                this.get('growl').errorShowRaw(adapterError.responseJSON.title, adapterError.responseJSON.detail);
            });

        },
        /**
         * Update the passwords list of the current folder
         * Is called by new-password/password (controller) on updating/creating new password
         */
        onUpdatePassword() {
            $('#loading').show();

            $.ajax({
                url: window.APP.host + '/' + window.APP.namespace + '/folders/' + this.get('folderId') + '/passwords',
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": "application/json",
                    "Authorization": "Bearer " + this.get('session.data.authenticated.token')
                }
            }).then((result) => {
                this.set('passwords', result._embedded.passwords);
                this.set('selectFolder', true);
                $('#loading').hide();
            }).catch((adapterError) => {
                this.set('passwords', null);
                $('#loading').hide();
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
