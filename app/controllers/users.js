/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
    store: inject('store'),
    actions: {
        /**
         * Update users list
         * It's called by new-user-element on creating a new user
         */
        onCreateUser() {
            this.store.query("user", {})
                .then((results) => {
                    this.set('users', results)
                })
                .catch((adapterError) => {
                    this.growl.errorShowRaw(adapterError.title, adapterError.message);
                });
        }
    }
});
