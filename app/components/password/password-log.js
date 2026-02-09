/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
    store: service('store'),
    growl: service('growl'),

            /**
         * Change password's logs page
         * 
         * @param {*} page - page number
         */
        submit: action(function(page) {
			debugger;
            this.changeLogPage(page);
            this.refreshLog(this.password.id);
        }),
});
