/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    router: inject('router'),
    session: inject('session'),
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
        }
    }
});
