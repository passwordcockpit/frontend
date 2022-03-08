/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import HalSerializer from "ember-data-hal-9000/serializer";

export default HalSerializer.extend({

    extractId(modelClass, resourceHash) {
        let id = this._super(...arguments);
        if (modelClass.modelName == "folderuser") {
            id = resourceHash['user_id'] + '_' + resourceHash['folder_id'];
        }
        return id + "";
    },
});