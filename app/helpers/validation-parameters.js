/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { helper } from '@ember/component/helper';
/**
 * Return received data as javascript object
 */
export function validationParameters(data, hash) {
    return hash;
}

export default helper(validationParameters);