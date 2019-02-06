/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import formElementValidation from '../../mixins/form/form-element-validation';

export default Component.extend(formElementValidation, {
    actions: {
        selectOptionChange(value) {
            this.set('value', value);
            this.send('keyUp');
        },
        printSelectValuesHandle(value) {
            if (this.get('printSelectValuesHandle') !== undefined) {
                return this.printSelectValuesHandle(value);
            }
            else{
                return value;
            }
        }
    }
});
