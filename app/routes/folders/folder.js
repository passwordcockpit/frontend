/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
    account: inject('account'),
    session: inject('session'),
    closeFoldersInputs: inject('close-folders-inputs'),
    beforeModel() {
        this._super(...arguments);
        window.loading.showLoading();
    },
    model(params, transition) {
        // Save current transition
        this.controllerFor('folders').set('transitionData', transition);
        
        let folder = this.get('store').peekRecord('folder', params.folder_id);
        let canAccessAllFolders = this.get('store').peekRecord('permission', this.get('account').getUserId()).get('access_all_folders');

        // Prepares the folder's path to send to the 'onSelectFolder' action
        let folderPath = [];
        let parentId = folder.parent_id;
        while (parentId != null) {
            let parentFolder = this.get('store').peekRecord('folder', parentId);
            folderPath.push(parentFolder);
            parentId = parentFolder.get('parent_id');
        }
        folderPath = folderPath.reverse();
        
        //Check that folder exists and that user has permission to access
        if (folder && (canAccessAllFolders || folder.get('access') === 2 || folder.get('access') === 1)) {
            this.controllerFor('folders.folder').send('onSelectFolder', { folderId: params.folder_id, folderPath: folderPath });
            folder.set('canAccessAllFolders', canAccessAllFolders);
            // Return model
            return {
                folder: folder,
                users: this.get('store').peekAll('user')
            }
        }
        else {
            return this.transitionTo('sorry-page');
        }
    },
    actions: {
        willTransition: function () {
            this.get('closeFoldersInputs').closeAllInputs();
        }
    },
});