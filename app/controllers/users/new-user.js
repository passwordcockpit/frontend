/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
    usersController: controller('users'),
    actions: {
        /**
         * Notify to users (controller) about the operation
         * Is called by new-user-element on Creating a new user
         */
        onCreateUser() {
            this.get('usersController').send('onCreateUser');
        }
    }
});