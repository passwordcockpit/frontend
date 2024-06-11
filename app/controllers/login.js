/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller from '@ember/controller';
import { inject } from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';
import formValidation from '../mixins/form/form-validation';

export default Controller.extend(formValidation, {
    intl: inject('intl'),
    session: inject('session'),
    growl: inject('growl'),
    username: null,
    password: null,
    router: inject('router'),

    init: function () {
        this._super(...arguments);
        this.set('error', [this.intl.t('This is a required field')]);
        this.clearOnSubmitError = this.clearOnSubmitError || ['username', 'password'];
    },
    actions: {
        /**
         * Perform authentication
         */
        save() {
            window.loading.showLoading();
            this.session.authenticate('authenticator:jwt', { username: this.username, password: this.password }).then(() => {
                this.set('errorMessage', null);
                var language = jwtDecode(this.get('session.data.authenticated.token'));

                //set language received from token
                this.set('intl.locale', language.data.language);
                window.loading.hideLoading();
                this.router.refresh();
                this.router.transitionTo('folders');
            })
                .catch((loginErrors) => {
                    //Empty form
                    this.set('username', '');
                    this.set('password', '');

                    window.loading.hideLoading();

                    if (loginErrors.hasOwnProperty('json')) {
                        this.growl.errorShowRaw(loginErrors.json.title, loginErrors.json.detail);
                    }
                    else {
                        this.growl.errorShowRaw(loginErrors.title, loginErrors.detail);
                    }
                });
        }
    }
});
