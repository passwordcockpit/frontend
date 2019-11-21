/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import { inject } from '@ember/service';
export default Route.extend({
    session: inject('session'),
    beforeModel: function () {
        this._super(...arguments);
        window.loading.showLoading(false);

        // Replace index route with folders one, which will be the application
        this.replaceWith('folders');
    }
});
