/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    parent_id: DS.attr(),
    access: DS.attr(),
    isAdd: DS.attr('boolean', { defaultValue: false }),
    isEdit: DS.attr('boolean', { defaultValue: false }),
});
