/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller, { inject as controller } from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
    foldersController: controller('folders'),
    growl: inject('growl'),
    session: inject('session'),
    store: inject('store'),
    isAdd: false,
    errors: null,

    actions: {
        /**
         * Notify to folders about the operation
         * Is called by folder-user on updating permission
         */
        onUpdatePermission() {
            this.foldersController.send('onUpdatePemission');
        },
        /**
         * Notify to folders about the operation
         * Is called by folder-user on deleting permission
         */
        onDeletePermission() {
            this.foldersController.send('onUpdatePemission');
        }
    }
});
