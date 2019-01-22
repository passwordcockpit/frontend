/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Service from '@ember/service';

/* global sjcl */
export default Service.extend({
    parameters: { 'mode': 'gcm' },
    encryptPassword(pin, password) {
        return sjcl.encrypt(pin, password, this.get('parameters'));
    },
    decryptPassword(pin) {
        return sjcl.decrypt(pin, password);
    }
});
