/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    store: inject('store'),
    growl: inject('growl'),

    actions: {
        /**
         * Change user-detail's logs page
         * 
         * @param {*} page - page number
         */
        submit(page) {
            let self = this;
            $('#loading').show();
            this.get('store').query('userlog', { userId: this.get('user').id, page: page }).then((logs) => {
                self.get('store').unloadAll('userlog');
                self.set('page', page);
                self.set('pageCount', logs.get('meta')._page_count);
                self.set('logs', logs);
                $('#loading').hide();
            })
                .catch((adapterError) => {
                    $('#loading').hide();
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                });
        }
    }
});
