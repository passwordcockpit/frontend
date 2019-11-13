/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';
import $ from 'jquery';

export default Component.extend({
    router: inject('router'),
    store: inject('store'),
    growl: inject('growl'),
    session: inject('session'),
    closeFoldersInputs: inject('close-folders-inputs'),
    errors: null,
    isManage: false,
    access: null,
    
    actions: {
        // Edit folder-user-permission
        
        /**
         * Show Edit permission form
         * Close the other opened inputs and reset Folder-user permission data
         */
        showEdit() {
            this.get('closeFoldersInputs').closeAllInputs();
            // set Manage checkbox
            if (this.folderUser.get('access') === 2) {
                this.set('access', true);
            } else {
                this.set('access', false);
            }

            this.folderUser.set('isEdit', true);
        },

        /**
         * Close Edit permission form
         */
        cancelEdit() {
            this.folderUser.set('isEdit', false);
            this.set('isManage', false);
        },
        /**
         * Update permission
         * Notify to folders (passing by folder-users) about the operation
         * 
         * @param {*} folderUser 
         * @param {*} folderId 
         */
        updatePermission(folderUser, folderId) {
            $('#loading').show();
            this._super(...arguments);
            folderUser.setAccess(this.get('access'));
            folderUser.save({ adapterOptions: { folder_id: folderId } }).then(() => {
                this.folderUser.set('isEdit', false);
                this.set('isManage', false);
                this.onUpdatePermission();
                $('#loading').hide();

                this.get('growl').notice('Success', 'Permission updated');
            })
                .catch((adapterError) => {
                    $('#loading').hide();
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                });
        },
        // delete permission

        /**
         * Show Delete permission confirmation dialog box
         * 
         * @param {*} id 
         */
        showConfirm(id) {
            let permissions = this.get('store').peekAll('folderuser');

            if(permissions.length == 1){
                $('#lastPermissionConfirm'+ id).modal('show');
            }
            else{
                $('#deletePermissionConfirm' + id).modal('show');
            }
        },
        /**
         * Close Delete permission confirmation dialog box
         * 
         * @param {*} id 
         */
        cancelFormConfirm(id) {
            $('#deletePermissionConfirm' + id).modal('hide');
            $('#lastPermissionConfirm' + id).modal('hide');
        },
        /**
         * Delete permission
         * 
         * @param {*} folderUser 
         * @param {*} folderId 
         */
        deletePermission(folderUser, folderId) {
            var userId = jwtDecode(this.get('session.session.content.authenticated.token'));
            this._super(...arguments);
            $('#deletePermissionConfirm').modal('hide');
            $('#lastPermissionConfirm').modal('hide');
            $('#loading').show();
            folderUser.destroyRecord({ adapterOptions: { folder_id: folderId } }).then(() => {
                $('#deletePermissionConfirm' + folderUser.id).modal('hide');
                $('#lastPermissionConfirm' + folderUser.id).modal('hide');
                this.get('growl').notice('Success', 'Permission deleted');

                // if user delete the permission of him/her-self
                if (userId.sub == parseInt(folderUser.id, 10)) {
                    this.get('router').transitionTo('folders');
                }
                this.onDeletePermission();
                $('#loading').hide();
            })
                .catch((adapterError) => {
                    $('#deletePermissionConfirm' + folderUser.id).modal('hide');
                    $('#loading').hide();
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                });
        }
    }
});
