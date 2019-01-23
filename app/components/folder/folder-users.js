/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    store: inject('store'),
    growl: inject('growl'),
    closeFoldersInputs: inject('close-folders-inputs'),
    actions: {
        /**
         * Show New permission form
         * Close the other opened inputs and clear errors data
         */
        addPermission() {
            this.get('closeFoldersInputs').closeAllInputs();
            this.set('isAdd', true);
            this.set('errors', null);
        },

        /**
         * Update the List of users with no-pemission 
         * after the creation of a new permission
         */
        reloadFolderUser() {
            $('#loading').show();
            let folder = this.get('folder');
            this.get('store').unloadAll('folderuser');
            this.get('store').query('folderuser', { folderId: folder.get('id') })
                .then((result) => {
                    this.set('folderUsers', result);
                    this.set('folderId', folder.get('id'));

                    // List of users with no right  
                    var folderUsersIndexesList = [];
                    result.forEach(folderUser => {
                        folderUsersIndexesList.push(folderUser.id);
                    });
                    var filteredUsers = this.users.filter(function (user) {
                        return !(folderUsersIndexesList.includes(user.id));
                    });
                    this.set('filteredUsers', filteredUsers);
                    $('#loading').hide();
                })
                .catch((adapterError) => {
                    $('#loading').hide();
                    if (adapterError.code != 401) {
                        this.get('growl').errorsDatabase(adapterError.errors);
                    }
                });
        },
        /**
         * Is called by folder-user on updating a permission
         * Notify to folders (passing by folders.folder.index) about the operation
         */
        onUpdatePermission() {
            this.onUpdatePermission();
        },
        /**
         * Is called by folder-user on deleting a permission
         * Notify to folders (passing by folders.folder.index) about the operation
         */
        onDeletePermission() {
            this.onDeletePermission();
            this.send('reloadFolderUser');
        },
    }
});
