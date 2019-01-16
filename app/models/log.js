/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import DS from 'ember-data';

export default DS.Model.extend({
    password_id: DS.attr(),
    password_title: DS.attr(),
    user_id: DS.attr(),
    userName: DS.attr('string'),
    action_date: DS.attr(),
    action: DS.attr(),
});
