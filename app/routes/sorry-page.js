/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Route from '@ember/routing/route';
import $ from 'jquery';

export default Route.extend({
    beforeModel() {
        this._super(...arguments);
        $('#loading').show();
    },
    afterModel(){
        this._super(...arguments);
        $('#loading').hide();
    }
});
