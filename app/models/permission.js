/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import DS from 'ember-data';

export default DS.Model.extend({
    manage_users: DS.attr('boolean'),
    create_folders: DS.attr('boolean'),
    access_all_folders: DS.attr('boolean'),
    view_logs: DS.attr('boolean')
});
