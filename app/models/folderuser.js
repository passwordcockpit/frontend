/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Model, { attr } from '@ember-data/model';

export default Model.extend({
    username: attr(),
    name: attr(),
    surname: attr(),
    access: attr(),
    enabled: attr(),
    isEdit: attr('boolean', { defaultValue: false }),
    setAccess(access){
        if(access){
            this.set('access', 2);
        } else {
            this.set('access', 1);
        }    
    }
});