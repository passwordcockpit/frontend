/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { helper } from '@ember/component/helper';
/**
* Display errors
* transform error messages into error div
*/
export function displayErrors([messages]) {
    let htmlResult = '';
    if (messages) {
        htmlResult += '<div class="errors-list">';
        let i = 0;
        for (i = 0; i < messages.length; i++) {
            htmlResult += '<p>' + messages[i] + '</p>';
        }
        htmlResult += '</div>';
    }
    return htmlResult;
}

export default helper(displayErrors);