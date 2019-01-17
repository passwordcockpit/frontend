/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    router: inject('router'),
    store: inject('store'),
    growl: inject('growl'),
    intl: inject('intl'),

    parentId: null,
    userId: null,
    access: false,
    tagName: '',
    actions: {
        /**
         * Exit the creation of a permission
         */
        cancel() {
            this.set('isAdd', false);
        },
        /**
         * Create new permission
         */
        submit(folderId, userId) {
            if(userId == undefined){
                this.set('errors', {
                    selectUser: [this.get('intl').t('This is a required field')],
                });
                return
            }
            $('#loading').show();

            let access = 1;
            if (this.get('access')) {
                access = 2;
            }
            this.get('store')
                .createRecord('folderuser', {
                    folder_id: folderId,
                    userId: userId.id,
                    access: access
                })
                .save()
                .then(() => {
                    $('#loading').hide();
                    this.get('growl').notice('Success', 'Permission created');
                    this.set('isAdd', false);
                    this.reloadFolderUser();
                })
                .catch((adapterError) => {
                    $('#loading').hide();
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                });
        }
    }
});
