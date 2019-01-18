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

    init: function () {
        this._super(...arguments);
        if (this.get('session.data.authenticated.authenticator') != undefined) {
            this.transitionToRoute('folders');
        }
    },
    actions: {
        /**
         * Perform authentication
         */
        authenticate: function () {
            this.set('errors', null);
            if ($('#loginForm').isValid()) {
                $('#loading').show();
                let { username, password } = this.getProperties('username', 'password');
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
                        this.get('growl').errorShowRaw(loginErrors.title, loginErrors.detail);
                    });
            }
        }
    }
});
