/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
    account: inject('account'),
    store: inject('store'),
    beforeModel() {
        this._super(...arguments);
        window.loading.showLoading();
    },
    model() {
        let folder_id = this.modelFor("folders.folder").folder.id;

        let folder = this.store.peekRecord('folder', folder_id);
        let canAccessAllFolders = this.store.peekRecord('permission', this.account.getUserId()).get('access_all_folders');

        // Hide passwords list on creating new Password
        this.controllerFor('folders.folder').send('hidePasswordsList');
        
        //Check that folder exists and that user has permission to access
        if (folder && (canAccessAllFolders || folder.get('access') === 2)) {
            return { folderId: folder_id };
        }
        else {
            return this.transitionTo('sorry-page');
        }
    },
    afterModel() {
        this._super(...arguments);
        window.loading.hideLoading();
    },
    actions: {
        willTransition: function () {
            // Show passwords list
            this.controllerFor('folders.folder').send('showPasswordsList');
        },
    },
});
