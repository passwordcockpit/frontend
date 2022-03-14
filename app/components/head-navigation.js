/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';
import formValidation from '../mixins/form/form-validation';
import ENV from '../config/environment';
import $ from 'jquery';

export default Component.extend(formValidation, {
    router: inject('router'),
    session: inject('session'),

    init() {
        this._super(...arguments);
        // Language options
        this.userLanguages = ENV.APP.userLanguages;
    },

    actions: {
        /**
         * Destroy user's session on logout
         */
        invalidateSession() {
            let self = this;
            $.ajax({
                url:
                    window.APP.host +
                    "/" +
                    window.APP.namespace +
                    "/token/logout",
                headers: {
                    Authorization:
                        "Bearer " + this.get("session.session.content.authenticated.token")
                },
                cache: false,
                contentType: false,
                processData: false,
                type: "DELETE"
            }).always(function () {
                self.get('session').invalidate();
            });
        },
        /**
         * Redirect to home page
         */
        transitionToHomePage() {
            this.router.transitionTo('application');
        },
        /**
         * How to handle printed value of select
         */
        printSelectValuesHandle(userLanguage) {
            return userLanguage.text
        },
    }

});
