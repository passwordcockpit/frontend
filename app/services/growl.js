/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Service, { inject } from '@ember/service'
import $ from 'jquery';

export default Service.extend({

    intl: inject('intl'),

    /**
     * Show success message
     * 
     * @param {*} title
     * @param {*} message
     */
    notice(title, message) {
        $.growl.notice({
            title: this.get('intl').t('Success'),
            message: this.get('intl').t(message)
        });
    },

    /**
     * Show warning message
     * 
     * @param {*} title
     * @param {*} message
     */
    warning(title, message) {
        $.growl.warning({
            title: this.get('intl').t('Warning'),
            message: this.get('intl').t(message)
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
            title: this.get('intl').t('Error'),
            message: this.get('intl').t(message),
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
            title: this.get('intl').t('Error'),
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
            this.errorShowRaw(this.get('intl').t('Error'), errors[key].messages.join('. '));
        });
    },
    /**
     * Convert Backend [errors] to array of messages identified by name
     * 
     * @param {*} adapterError
     * @param {*} responseJSON - boolean
     */
    errorsDatabaseToArray(adapterError) {
        let errors = null; //{}
        if (adapterError.hasOwnProperty('responseJSON')) {
            if (adapterError.responseJSON.hasOwnProperty('errors')) {
                Object.keys(adapterError.responseJSON.errors).forEach(key => {
                    let name = adapterError.responseJSON.errors[key].name;
                    let message = adapterError.responseJSON.errors[key].messages;
                    //errors[name] = message;
                    this.errorShowRaw('', name + ': ' + message);
                });
            }
        }
        else {
            if (adapterError.hasOwnProperty('errors')) {
                Object.keys(adapterError.errors).forEach(key => {
                    let name = adapterError.errors[key].name;
                    let message = adapterError.errors[key].messages;
                    //errors[name] = message;
                    this.errorShowRaw('', name + ': ' + message);
                });
            }
        }
        return errors;
    },
});