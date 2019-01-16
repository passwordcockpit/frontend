/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';

export default Component.extend({
    actions: {
        /**
         * Toggle passwords list visibility (only for mobile)
         */
        showPasswordsList() {
            this.showPasswordsList();
        },
        hidePasswordsList() {
            this.hidePasswordsList();
        },
    }
});
