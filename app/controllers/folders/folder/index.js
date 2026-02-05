/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller, { inject as controller } from '@ember/controller';
import { inject } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
    foldersController: controller('folders'),
    growl: inject('growl'),
    session: inject('session'),
    store: inject('store'),
    isAdd: false,
    errors: null,

        /**
         * Notify to folders about the operation
         * Is called by folder-user on updating permission
         */
        onUpdatePermission: action(function() {
            this.foldersController.send('onUpdatePemission');
        }),
        /**
         * Notify to folders about the operation
         * Is called by folder-user on deleting permission
         */
        onDeletePermission: action(function() {
            this.foldersController.send('onUpdatePemission');
        })

});
