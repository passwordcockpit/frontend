/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';
import RSVP from 'rsvp';
import $ from 'jquery'

export default Route.extend(AuthenticatedRouteMixin, {
    growl: inject('growl'),

    beforeModel() {
        this._super(...arguments);
        $('#loading').show();
    },
    model() {
        let modelData = this.modelFor("folders.folder");
        this.get('store').unloadAll('folderuser');
        let results = {
            folder: modelData.folder,
            folderName: modelData.folder.get('name'),
            folderId: modelData.folder.get('id'),
            users: modelData.users,
            folderUsers: this.get('store').query('folderuser', { folderId: modelData.folder.get('id') })
        }
        return RSVP.hash(results).then((hash) => {
            if (results.users != undefined) {
                // List of users with no right    
                var folderUsersIndexesList = [];
                hash.folderUsers.forEach(folderUser => {
                    folderUsersIndexesList.push(folderUser.id);
                });
                var filteredUsers = results.users.filter(function (user) {
                    return !(folderUsersIndexesList.includes(user.id));
                });
                hash.filteredUsers = filteredUsers;
                return hash;
            }
        }).catch(() => {
            this.get('growl').error('Error', "Error while retrieving users's folder permissions");
        })
    },
    afterModel() {
        this._super(...arguments);
        $('#loading').hide();
    },
});
