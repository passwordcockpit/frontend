import Mixin from "@ember/object/mixin";
import { inject } from "@ember/service";

/**
 * This Mixin manage the elements form validation
 */
export default Mixin.create({
  intl: inject("intl"),
  isElementValid: null,
  errorMessage: null,
  showElementMessage: false,
  init() {
    this._super(...arguments);
    // populate object for form validation on submit
    this.get("isFormValid").pushObject({
      name: this.get("name"),
      isElementValid: this.get("isElementValid")
    });
    // validate element on load
    this.validation(false);
  },
  /**
   * min length validation
   *
   * @param {length} integer
   */
  checkMinLength: function(length) {
    if (this.get("value").length < length) {
      return false;
    }
    return true;
  },
  /**
   * validation
   *
   * @param {boolean} showEMessage
   */
  validation: function(showElementMessage) {
    let isElementValid = true;
    
    // required
    if (this.get("required") && !this.get("value")) {
      this.set("errorMessage", this.get("intl").t("This is a required field"));
      isElementValid = false;
    } else if (this.get("minLength")) {
      // min length
      if (!this.checkMinLength(this.get("minLength"))) {
        this.set("errorMessage", this.get("intl").t("Error minlength TODO"));
        isElementValid = false;
      }
    }

    // show / hide message
    this.set("showElementMessage", showElementMessage);
    this.set("isElementValid", isElementValid);

    // update object for form validation on submit
    this.get("isFormValid").filterBy(
      "name",
      this.get("name")
    )[0].isElementValid = isElementValid;

    return isElementValid;
  },
  actions: {
    keyUp() {
      this.validation(true);
    }
  }
});
