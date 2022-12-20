/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
    session: inject('session'),
    router: inject('router'),

    beforeModel() {
        this._super(...arguments);
        window.loading.showLoading(false);
        if (this.session.get('isAuthenticated')) {
            this.router.transitionTo('folders');
        }
    },
    afterModel() {
        this._super(...arguments);
        window.loading.hideLoading();
    },
});