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
    actions: {

        /**
         * Show Edit user-rights form
         */
        editPermission() {
            this.set('isEdit', true);
        },
        /**
         * Close Edit user-rights form
         */
        cancel() {
            this.set('isEdit', false);
            this.permission.rollbackAttributes();
        },
        /**
         * Edit user-rights
         */
        submit() {
            window.loading.showLoading();
            let permission = this.permission;
            permission.save()
                .then(() => {
                    this.set('isEdit', false);
                    this.onUpdateUserRight(permission.id);
                    this.growl.notice('Success', 'Permission updated');
                    window.loading.hideLoading();
                })
                .catch((adapterError) => {
                    this.growl.errorShowRaw(adapterError.title, adapterError.message);
                    window.loading.hideLoading();
                });
        }
    }
});
