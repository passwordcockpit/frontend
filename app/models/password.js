/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    icon: DS.attr(),
    folder_id: DS.attr(),
    description: DS.attr(),
    username: DS.attr(),
    password: DS.attr(),
    url: DS.attr(),
    tags: DS.attr(),
    fileId: DS.attr(),
    fileName: DS.attr(),
    last_modification_date: DS.attr()
});
