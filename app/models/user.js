/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
    username: attr(),
    password: attr(),
    actual_password: attr(),
    name: attr(),
    surname: attr(),
    fullName: computed('name', 'surname', function() {
        return this.name + ' ' + this.surname;
    }),
    phone: attr(),
    email: attr(),
    enabled: attr(),
    language: attr(),
    token:  attr(),
    forceLogin: attr(),
});
