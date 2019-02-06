/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller from '@ember/controller';
import { inject } from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';
import formValidation from '../mixins/form/form-validation';
import $ from 'jquery';

export default Controller.extend(formValidation, {
    intl: inject('intl'),
    session: inject('session'),
    growl: inject('growl'),
    username: null,
    password: null,
    init: function () {
        this._super(...arguments);
        this.set('error', [this.get('intl').t('This is a required field')]);
        this.clearOnSubmitError = this.clearOnSubmitError || ['username', 'password'];
        if (this.get('session.data.authenticated.authenticator') != undefined) {
            this.transitionToRoute('folders');
        }
    },
    actions: {
        /**
         * Perform authentication
         */
        save() {
            $('#loading').show();
            this.get('session').authenticate('authenticator:jwt', { username: this.get('username'), password: this.get('password') }).then(() => {
                this.set('errorMessage', null);
                var language = jwtDecode(this.get('session.data.authenticated.token'));

                //set language received from token
                this.set('intl.locale', language.data.language);
                $('#loading').hide();

                this.transitionToRoute('folders');
            })
                .catch((loginErrors) => {
                    //Empty form
                    this.set('username', '');
                    this.set('password', '');

                    $('#loading').hide();

                    if (loginErrors.hasOwnProperty('json')) {
                        this.get('growl').errorShowRaw(loginErrors.json.title, loginErrors.json.detail);
                    }
                    else {
                        this.get('growl').errorShowRaw(loginErrors.title, loginErrors.detail);
                    }
                });
        }
    }
});
