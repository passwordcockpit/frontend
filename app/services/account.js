/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Service from '@ember/service'
export default Service.extend({
    user: null,

    setUser(user) {
        this.set('user', user);
    },

    getUserId() {
        return this.user.id;
    }

});