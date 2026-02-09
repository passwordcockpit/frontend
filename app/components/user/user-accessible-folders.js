/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
    store: service('store'),
    growl: service('growl'),
    loading: false,

    
        /**
         * Change user-detail's "User's accessible folders" page
         * 
         * @param {*} page - page number
         */
        submit: action(function(page) {
            let self = this;
            this.set('loading', true);
            window.loading.showLoading();
            self.get('store').unloadAll('folderuser');
            this.store.query('folderuser', { userId: this.user.id, page: page }).then((folderusers) => {
                self.set('page', page);
                self.set('pageCount', folderusers.meta._page_count);
                self.set('folderusers', folderusers);
                this.set('loading', false);
                window.loading.hideLoading();
            }).catch((adapterError) => {
                this.set('loading', false);
                window.loading.hideLoading();
                this.growl.errorShowRaw(adapterError.title, adapterError.message);
            });
        })
});