/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Mixin from "@ember/object/mixin";

/**
 * This Mixin manage the form validation
 */
export default Mixin.create({
    isFormValid: [],
    showMessage: false,
    init(){
        this._super(...arguments);
        this.set('isFormValid', []);
    },
    actions: {
        submit(){
            let self = this;
            if (this.get('isFormValid').isEvery('isElementValid', true)) {
                this.send('save');
            }else{
                // frontend validation NOK
                this.set('showMessage', true);
                this.get('growl').error('Form not saved', 'Validation error');

                /* reset values */
                if(this.get('clearOnSubmitError')){
                    this.get('clearOnSubmitError').forEach(function(element) {
                        self.set(element, '');
                    })
                }
            }
        }
    }
});
