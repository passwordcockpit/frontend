/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import HalAdapter from "ember-data-hal-9000/adapter";
import ENV from '../config/environment';
import { inject } from '@ember/service';

export default HalAdapter.extend({
    session: inject('session'),

    init() {
        this._super(...arguments);
        this.host = ENV.APP.host;
        this.namespace = ENV.APP.namespace;
    },

    // Dynamically set the headers before each request
    get headers() {
        let { token } = this.get('session.data.authenticated');
        return {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json',
            "Accept": "application/json"
        };
    },

    handleResponse(status) {
        if (status === 401 && this.get('session.isAuthenticated')) {
            this.get('session').invalidate();
        }
        return this._super(...arguments);
    },

    // authorize(xhr) {
    //     let { token } = this.get('session.data.authenticated');
    //     xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    // },
});