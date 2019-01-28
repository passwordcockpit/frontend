/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery'

export default Component.extend({
    store: inject('store'),
    growl: inject('growl'),
    parentId: null,

    isFormValid: [],
    showMessage: false,
    
    actions: {
        /**
         * Exit the creation of a folder
         */
        cancel() {
            if (this.get('parentId') != null) {
                this.get('store').peekRecord('folder', this.get('parentId')).set('isAdd', false);
            }
            else {
                this.cancelAddFolder();
            }
        },
        /**
         * Create new folder
         */
        submit() {
            $('#loading').show();
            let folderToCreate = this.get('store')
                .createRecord('folder', {
                    name: this.get('folderName'),
                    parent_id: this.get('parentId')
                });
            folderToCreate
                .save()
                .then((result) => {

                    this.get('growl').notice('Success', 'Folder created');

                    if (this.get('parentId') == null) {
                        this.cancelAddFolder();
                    }
                    this.onCreateFolder(result.id);
                    $('#loading').hide();
                })
                .catch((adapterError) => {
                    $('#loading').hide();
                    folderToCreate.deleteRecord();
                    let errors = this.get('growl').errorsDatabaseToArray(adapterError);
                    this.set('errors', errors);
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                });
        },
    }
});
