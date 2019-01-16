/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    router: inject('router'),
    actions: {
        /**
         * Destroy user's session on logout
         */
        invalidateSession() {
            this.get('session').invalidate();
        },
        /**
         * Redirect to home page
         */
        transitionToHomePage(){
            this.get('router').transitionTo('application');
        }
    }
});
