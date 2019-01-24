/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller from '@ember/controller';
import { inject } from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';
import $ from 'jquery';

export default Controller.extend({
    intl: inject('intl'),
    session: inject('session'),
    growl: inject('growl'),
    isFormValid: [],
    showMessage: false,
    init: function () {
        this._super(...arguments);
        this.set('error', [this.get('intl').t('This is a required field')]);
        if (this.get('session.data.authenticated.authenticator') != undefined) {
            this.transitionToRoute('folders');
        }
    },
    actions: {
        /**
         * Perform authentication
         */
        authenticate: function () {
            if (this.get('isFormValid').isEvery('isElementValid', true)) {
                // frontend validation OK
                $('#loading').show();
                this.get('session').authenticate('authenticator:jwt', { username: username.value, password: password.value }).then(() => {
                    this.set('errorMessage', null);
                    var language = jwtDecode(this.get('session.data.authenticated.token'));

                    //set language received from token
                    this.set('intl.locale', language.data.language);
                    $('#loading').hide();

                    if (this.get('session.data.authenticated.firstTimeLogin') !== undefined) {
                        this.transitionToRoute('profile');
                    } else {
                        this.transitionToRoute('folders');
                    }
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
            }else{
                // frontend validation NOK
                this.set('showMessage', true);
                this.set('username', '');
                this.set('password', '');
                this.get('growl').error('Login TODO', 'error TODO');
            }
        },
    }
});
