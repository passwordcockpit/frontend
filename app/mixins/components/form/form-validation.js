import Mixin from '@ember/object/mixin';
import { inject } from '@ember/service';


/**
 * This Mixin manage the elements form validation
 */
export default Mixin.create({
    intl: inject('intl'),
    isElementValid: true,
    errorMessage: null,
    init() {
        this._super(...arguments);
        this.get('isFormValid').pushObject(
            {
                name: this.get('name'),
                isElementValid: null
            }
        )
        // validate on load
        this.validation(false);
    },
    /**
    * min lenghth validation 
    * 
    * @param {length} integer 
   */
    checkMinLength: function (length) {
        if (this.get('value').length < length) {
            return false;
        }
        return true;
    },
    /**
        * validation
        * 
        * @param {boolean} showMessage 
        */
    validation: function (showMessage) {
        let isElementValid = true;
        let isFormValid = this.get('isFormValid');

        // required
        if (this.get('required') && !this.get('value')) {
            this.set('errorMessage', this.get('intl').t('This is a required field'));
            isElementValid = false;
        } else if (this.get('minLength')) {
            // min length
            if (!this.checkMinLength(this.get('minLength'))) {
                this.set('errorMessage', this.get('intl').t('Error minlength TODO'));
                isElementValid = false;
            }
        }
        // show / hide message
        this.set('showMessage', showMessage);

        // set error message
        this.set('isElementValid', isElementValid);

        // update object for form validation on submit
        isFormValid.filterBy('name', this.get('name'))[0].isElementValid = isElementValid;
    },
    actions: {
        keyUp() {
            this.validation(true);
        }
    }
});