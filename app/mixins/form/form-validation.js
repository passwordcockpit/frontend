import Mixin from "@ember/object/mixin";

/**
 * This Mixin manage the form validation
 */
export default Mixin.create({
    isFormValid: [],
    showMessage: false,
    actions: {
        submit(){
            let self = this;
            if (this.get('isFormValid').isEvery('isElementValid', true)) {
                this.send('save');
                this.set('isFormValid', []);
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
