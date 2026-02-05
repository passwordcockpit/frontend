/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
        /**
         * Toggle passwords list visibility (only for mobile)
         */
        handleShowPasswordsList: action(function() {
			console.log("gugugaga");
            this.showPasswordsList();
        }),
        handleHidePasswordsList: action (function() {
			console.log("gugu");
            this.hidePasswordsList();
        })
});
