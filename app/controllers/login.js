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
    errors: null,
    init: function () {
        this._super(...arguments);
        if (this.get('session.data.authenticated.authenticator') != undefined) {
            this.transitionToRoute('folders');
        }
    },
    isValid: function (username, password) {
        let errors = {};
        if (username == undefined || username == '') {
            errors.username = [this.get('intl').t('This is a required field')];
        }
        if (password == undefined || password == '') {
            errors.password = [this.get('intl').t('This is a required field')];
        }
        else if (password.length <= 4) {
            errors.password = [this.get('intl').t('String length is too short')];
        }
        let size = Object.keys(errors).length;
        if (size != 0) {
            this.set('errors', errors);
        }
        return size == 0;
    },
    actions: {
        /**
         * Perform authentication
         */
        authenticate: function () {
            this.set('errors', null);
            let { username, password } = this.getProperties('username', 'password');
            if (this.isValid(username, password)) {
                $('#loading').show();
                this.get('session').authenticate('authenticator:jwt', { username: username, password: password }).then(() => {
                    this.set('errorMessage', null);
                    var language = jwtDecode(this.get('session.data.authenticated.token'));

                    //set language received from token
                    this.set('intl.locale', language.data.language);
                    $('#loading').hide();
                    this.transitionToRoute('folders');
                })
                    .catch((loginErrors) => {
                        //Empty form
                        $('#username').val('');
                        $('#password').val('');

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
    }
});
