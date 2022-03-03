/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Model, { attr } from '@ember-data/model';

export default Model.extend({
    title: attr(),
    icon: attr(),
    folder_id: attr(),
    description: attr(),
    username: attr(),
    password: attr(),
    frontendCrypted: attr(),
    url: attr(),
    tags: attr(),
    fileId: attr(),
    fileName: attr(),
    last_modification_date: attr()
});
