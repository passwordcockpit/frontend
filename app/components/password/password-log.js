/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    store: inject('store'),
    growl: inject('growl'),

    actions: {
        /**
         * Change password's logs page
         * 
         * @param {*} page - page number
         */
        submit(page) {
            this.changeLogPage(page);
            this.refreshLog(this.get('password').id);
        },
    }
});
