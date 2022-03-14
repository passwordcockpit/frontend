/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';
import ENV from '../../config/environment';
import formElementValidation from '../../mixins/form/form-element-validation';
import formValidation from '../../mixins/form/form-validation';

export default Component.extend(formElementValidation, formValidation, {
    session: inject('session'),
    intl: inject('intl'),
    growl: inject('growl'),

    init() {
        this._super(...arguments);
        // Language options
        this.userLanguages = ENV.APP.userLanguages;
    },

    actions: {
        selectOptionChange(value) {
            this.set('value', value);
            if(this.isHeaderLanguage){
                this.send('submit');
            }else{
                this.send('keyUp');
            }
        },
        printSelectValuesHandle(value) {
            if (this.printSelectValuesHandle !== undefined) {
                return this.printSelectValuesHandle(value);
            }
            else{
                return value;
            }
        },
        /**
         * Edit user's language in header-navigation
         */
        save() {
            window.loading.showLoading();
            let self = this;
            let user = this.user;
            
            // set language
            user.set('language', $('select[name=language] option:selected').val());

            user.save()
                .then((userData) => {

                    var userId = jwtDecode(self.get('session.session.content.authenticated.token'));

                    // If user edit him/her self
                    if (userId.sub == parseInt(userData.id, 10)) {
                        if (!userData.get('enabled')) {
                            this.session.invalidate();
                        } else {
                            //Update language
                            this.set('intl.locale', user.get('language'));
                            // Update token
                            if (userData.get('token') !== undefined && userData.get('token') !== '') {
                                this.set('session.data.authenticated.token', userData.get('token'));
                            }
                            let sessionData = self.get('session.data');
                            self.get('session.store').persist(sessionData);
                        }
                    }

                    window.loading.hideLoading();
                    location.reload(true);
                })
                .catch(adapterError => {
                    let errors = this.growl.errorsDatabaseToArray(adapterError);
                    this.set('errors', errors);
                    this.growl.errorShowRaw(adapterError.title, adapterError.message);
                    window.loading.hideLoading();
                });
        },
    }
});
