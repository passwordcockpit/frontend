/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
    session: inject('session'),

    showChangePasswordMessage: false,
    init: function () {
        this._super(...arguments);
        if (this.get('session.data.authenticated.tokenData.data.change_password')) {
            this.set('showChangePasswordMessage', true);
        }
    },
});
