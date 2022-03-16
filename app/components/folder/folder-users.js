/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';

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
            this.closeFoldersInputs.closeAllInputs();
            this.set('isAdd', true);
            this.set('errors', null);
        },

        /**
         * Update the List of users with no-pemission 
         * after the creation of a new permission
         */
        reloadFolderUser() {
            window.loading.showLoading();
            let folder = this.folder;
            this.store.unloadAll('folderuser');
            this.store.query('folderuser', { folderId: folder.get('id') })
                .then((result) => {
                    this.set('folderUsers', result);
                    this.set('folderId', folder.get('id'));
                    // List of users with no right  
                    var folderUsersIndexesList = [];
                    result.forEach(folderUser => {
                        // Extracting the userId because of the customized id in the serializer (userId_folderId)
                        var id = folderUser.id.substring(0,folderUser.id.indexOf('_'));
                        folderUsersIndexesList.push(id);
                    });
                    var filteredUsers = this.users.filter(function (user) {
                        return !(folderUsersIndexesList.includes(user.id));
                    });
                    this.set('filteredUsers', filteredUsers);
                    window.loading.hideLoading();
                })
                .catch((adapterError) => {
                    window.loading.hideLoading();
                    if (adapterError.code != 401) {
                        this.growl.errorsDatabase(adapterError.errors);
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
