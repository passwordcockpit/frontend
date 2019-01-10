/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Service, { inject } from '@ember/service'
import $ from 'jquery';

export default Service.extend({

    i18n: inject('i18n'),

    /**
     * Show success message
     * 
     * @param {*} title
     * @param {*} message
     */
    notice(title, message) {
        $.growl.notice({
            title: this.get('i18n').t('Success'),
            message: this.get('i18n').t(message)
        });
    },

    /**
     * Show error message
     * 
     * @param {*} title
     * @param {*} message
     */
    error(title, message) {
        $.growl.error({
            title: this.get('i18n').t('Error'),
            message: this.get('i18n').t(message),
            fixed: true
        });
    },
    /**
     * Show error message without translation
     * 
     * @param {*} title
     * @param {*} message
     */
    errorShowRaw(title, message) {
        $.growl.error({
            title: this.get('i18n').t('Error'),
            message: message,
            fixed: true
        });
    },
    /**
     * Show Backend [errors] messages
     * 
     * @param {*} errors
     */
    errorsDatabase(errors) {
        Object.keys(errors).forEach(key => {
            this.errorShowRaw(this.get('i18n').t('Error'), errors[key].messages.join('. '));
        });
    },
    /**
     * Convert Backend [errors] to array of messages identified by name
     * 
     * @param {*} adapterError
     * @param {*} responseJSON - boolean
     */
    errorsDatabaseToArray(adapterError) {
        let errors = {};
        if (adapterError.hasOwnProperty('responseJSON')) {
            if (adapterError.responseJSON.hasOwnProperty('errors')) {
                Object.keys(adapterError.responseJSON.errors).forEach(key => {
                    errors[adapterError.responseJSON.errors[key].name] = adapterError.responseJSON.errors[key].messages;
                });
            }
        }
        else {
            if (adapterError.hasOwnProperty('errors')) {
                Object.keys(adapterError.errors).forEach(key => {
                    errors[adapterError.errors[key].name] = adapterError.errors[key].messages;
                });
            }
        }
        return errors;
    },
});