/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Route.extend({
    account: inject('account'),
    beforeModel() {
        this._super(...arguments);
        $('#loading').show();
    },
    model(params, transition) {
        let folder = this.get('store').peekRecord('folder', transition.params['folders.folder'].folder_id);
        let canAccessAllFolders = this.get('store').peekRecord('permission', this.get('account').getUserId()).get('access_all_folders');

        // Hide passwords list on creating new Password
        this.controllerFor('folders.folder').send('hidePasswordsList');
        
        //Check that folder exists and that user has permission to access
        if (folder && (canAccessAllFolders || folder.get('access') === 2)) {
            return { folderId: transition.params['folders.folder'].folder_id };
        }
        else {
            return this.transitionTo('sorry-page');
        }
    },
    afterModel() {
        this._super(...arguments);
        $('#loading').hide();
    },
    actions: {
        willTransition: function () {
            // Show passwords list
            this.controllerFor('folders.folder').send('showPasswordsList');
        },
    },
});
