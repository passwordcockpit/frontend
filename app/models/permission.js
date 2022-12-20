/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Model, { attr } from '@ember-data/model';

export default Model.extend({
    manage_users: attr('boolean'),
    create_folders: attr('boolean'),
    access_all_folders: attr('boolean'),
    view_logs: attr('boolean')
});
