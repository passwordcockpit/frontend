/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';

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
            window.loading.showLoading();
            self.get('store').unloadAll('userlog');
            this.store.query('userlog', { userId: this.user.id, page: page }).then((logs) => {
                self.set('page', page);
                self.set('pageCount', logs.meta._page_count);
                self.set('logs', logs);
                this.set('loading', false);
                window.loading.hideLoading();
            }).catch((adapterError) => {
                this.set('loading', false);
                window.loading.hideLoading();
                this.growl.errorShowRaw(adapterError.title, adapterError.message);
            });
        }
    }
});
