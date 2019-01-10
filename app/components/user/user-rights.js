/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery'

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
            this.get('permission').rollbackAttributes();
        },
        /**
         * Edit user-rights
         */
        submit() {
            $('#loading').show();
            let permission = this.get('permission');
            permission.save()
                .then(() => {
                    this.set('isEdit', false);
                    this.onUpdateUserRight(permission.id);
                    this.get('growl').notice('Success', 'Permission updated');
                    $('#loading').hide();
                })
                .catch((adapterError) => {
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                    $('#loading').hide();
                });
        }
    }
});
