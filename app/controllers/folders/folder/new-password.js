/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
    folderController: controller('folders.folder'),

    actions: {
        /**
         * Is called by folder-user on creating new Password
         * Notify to folders.folder about the operation
         */
        onCreatePassword() {
            this.get('folderController').send('onUpdatePassword');
        }
    }
});
