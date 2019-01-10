/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import $ from 'jquery';

export default Route.extend(AuthenticatedRouteMixin, {
    beforeModel() {
        this._super(...arguments);
        $('#loading').show();
    },
    afterModel() {
        this._super(...arguments);
        $('#loading').hide();
    }
});