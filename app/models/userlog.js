/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Model, { attr } from '@ember-data/model';

export default Model.extend({
    password_id: attr(),
    password_title: attr(),
    password_folder: attr(),
    user_id: attr(),
    action_date: attr(),
    action: attr()
});
