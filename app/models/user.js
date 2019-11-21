/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr(),
    password: DS.attr(),
    actual_password: DS.attr(),
    name: DS.attr(),
    surname: DS.attr(),
    fullName: computed('name', 'surname', function() {
        return this.get('name') + ' ' + this.get('surname');
    }),
    phone: DS.attr(),
    email: DS.attr(),
    enabled: DS.attr(),
    language: DS.attr(),
    token:  DS.attr(),
    forceLogin: DS.attr(),
});
