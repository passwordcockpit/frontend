/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Service, { inject } from '@ember/service'
export default Service.extend({
    store: inject('store'),
    route: null,

    init(route){
        this._super(...arguments);
        this.set('route', route);
    },
    /**
     * Close inputs and clear not submit Folder/Folder-User creation/updating data
     */
    closeAllInputs: function(){
        this.closeFoldersInputs();
        this.closeFolderUserInputs();
    },
    /**
     * Close inputs and clear not submit Folder creation/updating data
     */
    closeFoldersInputs: function(){
        this.route.controllerFor('folders').set('isAdd', false);
        this.get('store').peekAll('folder').forEach((item) => {
            if (item.get('isEdit')) {
                item.rollbackAttributes();
            }
            item.set('isEdit', false);
            item.set('isAdd', false);
        });
    },
    /**
     * Close inputs and clear not submit Folder-User permission creation/update data
     */
    closeFolderUserInputs: function () {
        this.route.controllerFor('folders.folder.index').set('isAdd', false);
        this.get('store').peekAll('folderuser').forEach((item) => {
            if (item.get('isEdit')) {
                item.rollbackAttributes();
            }
            item.set('isEdit', false);
        });
    }
});