/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr(),
    name: DS.attr(),
    surname: DS.attr(),
    access: DS.attr(),
    enabled: DS.attr(),
    isEdit: DS.attr('boolean', { defaultValue: false }),
    setAccess(access){
        if(access){
            this.set('access', 2);
        } else {
            this.set('access', 1);
        }    
    }
});