/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import $ from 'jquery';
import ENV from './../../config/environment';
import { inject } from '@ember/service';
/* global sjcl */

export default Component.extend({
    growl: inject('growl'),
    store: inject('store'),
    options: ENV.passwordFormConfig.options,
    parameters: null,
    originPassword: '',
    init() {
        this._super(...arguments);
        this.set('originPassword', this.get('password'));
        this.set('parameters', { 'mode': 'gcm' });
    },
    actions: {
        /**
         * Refresh password
         */
        refreshPassword() {
            this.onUpdatePasswordPassword(this.get('originPassword'));
        },
        /**
         * Encrypt password
         */
        encryptPassword() {
            let pin = $('input[name="password-encryption-pin"]').val();
            if (pin != '') {
                let passwordEncrypted = sjcl.encrypt(pin, $('input[name="password"]').val(), this.get('parameters'));
                this.onUpdatePasswordPassword(passwordEncrypted)
            }
        },
        /**
         * Decrypt password
         */
        decryptPassword() {
            let pin = $('input[name="password-encryption-pin"]').val();
            if (pin != '') {
                try {
                    let passwordDecrypted = sjcl.decrypt(pin, $('input[name="password"]').val());
                    this.onUpdatePasswordPassword(passwordDecrypted)
                } catch (exception) {
                    this.get('growl').errorShowRaw('Error', exception.message);
                }
            }
        },
        /**
         * Close Encrypt password Options' panel
         */
        closePasswordEncryptOption() {
            $('.password-encrypt-form').slideUp();
        },
    }
});
