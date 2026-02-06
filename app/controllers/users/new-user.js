/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller, { inject as controller } from '@ember/controller';
import { action } from '@ember/object'

export default Controller.extend({
    usersController: controller('users'),
        /**
         * Notify to users (controller) about the operation
         * Is called by new-user-element on Creating a new user
         */
        onCreateUser: action(function() {
            this.usersController.send('onCreateUser');
        })
});