/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    store: inject('store'),
    growl: inject('growl'),
    loading: false,

    actions: {
        /**
         * Change user-detail's logs page
         * 
         * @param {*} page - page number
         */
        submit(page) {
            let self = this;
            this.set('loading', true);
            $('#loading').show();
            self.get('store').unloadAll('userlog');
            this.get('store').query('userlog', { userId: this.get('user').id, page: page }).then((logs) => {
                self.set('page', page);
                self.set('pageCount', logs.get('meta')._page_count);
                self.set('logs', logs);
                this.set('loading', false);
                $('#loading').hide();
            }).catch((adapterError) => {
                this.set('loading', false);
                $('#loading').hide();
                this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
            });
        }
    }
});
