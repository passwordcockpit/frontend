/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import formValidation from '../../mixins/form/form-validation';
import {action} from '@ember/object'

export default Component.extend(formValidation, {
    store: inject('store'),
    growl: inject('growl'),
    parentId: null,

        /**
         * Exit the creation of a folder
         */
        cancel: action(function() {
            if (this.parentId != null) {
                this.store.peekRecord('folder', this.parentId).set('isAdd', false);
            }
            else {
                this.cancelAddFolder();
            }
        }),
        /**
         * Create new folder
         */
        save: action(function() {
            window.loading.showLoading();
            let folderToCreate = this.store
                .createRecord('folder', {
                    name: this.folderName,
                    parent_id: this.parentId
                });
            folderToCreate
                .save()
                .then((result) => {

                    this.growl.notice('Success', 'Folder created');

                    if (this.parentId == null) {
                        this.cancelAddFolder();
                    }
                    this.onCreateFolder(result.id);
                    window.loading.hideLoading();
                })
                .catch((adapterError) => {
                    window.loading.hideLoading();
                    folderToCreate.deleteRecord();
                    let errors = this.growl.errorsDatabaseToArray(adapterError);
                    this.set('errors', errors);
                    this.growl.errorShowRaw(adapterError.title, adapterError.message);
                });
        }),
    
});
