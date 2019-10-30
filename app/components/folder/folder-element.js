/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import formValidation from '../../mixins/form/form-validation';
import $ from 'jquery';

export default Component.extend(formValidation,{
    store: inject('store'),
    closeFoldersInputs: inject('close-folders-inputs'),
    growl: inject('growl'),
    isManage: false,
    errors: null,
    actions: {
        /**
         * Close New folder form and notify to folders about the creation of new folder
         * Is called by new-folder-element on creating new Folder
         * 
         * @param {*} folderId 
         */
        onCreateFolder(folderId) {
            this.folder.set('isAdd', false);
            this.onCreateFolder(folderId);
        },
        /**
         * Notify to folders about the creation of new folder
         * Is called by submit() on updating new Folder
         */
        onUpdateFolder() {
            this.onUpdateFolder();
        },
        /**
         * Notify to folders about the deletion of folder
         * 
         * @param {*} folderId 
         */
        onDeleteFolder(folderId) {
            this.onDeleteFolder(folderId);
        },

        // delete folder

        /**
         * Show Delete folder confirmation dialog box
         * 
         * @param {*} folderId 
         */
        showConfirm(folderId) {
            $('#deleteFolderConfirm' + folderId).modal('show');
            $('#deleteFolderConfirm' + folderId).appendTo('body');  //To prevent modal from being shown behind other divs and backdrop
        },

        collapseFolder(folderId){
            // this variable can be used to know if it is a slideUp or slideDown animation
            let toggleUp = $('[data-id=collapse-' + folderId + ']').is(':visible');
            $('[data-id=collapse-' + folderId + ']').slideToggle({complete: function (){
                if(toggleUp){
                    $("#collapse-icon-" + folderId).html('<i class="fas fa-chevron-right"></i>');
                }
                else{
                    $("#collapse-icon-" + folderId).html('<i class="fas fa-chevron-down"></i>');
                }
            }});
            
        },
        /**
         * Close Delete folder confirmation dialog box
         * 
         * @param {*} folderId 
         */
        cancelFormConfirm(folderId) {
            $('#deleteFolderConfirm' + folderId).modal('hide');
        },

        // Add new folder

        /**
         * Show New folder form
         * Close the other opened inputs and reset the related data
         */
        showAdd() {
            this.get('closeFoldersInputs').closeAllInputs();
            this.folder.set('isAdd', true);
            this.set('isManage', false);
            this.set('errors', null);
        },

        // Update folder

        /**
         * Show Edit folder form
         * Close the other opened inputs and reset the related data
         */
        showEdit() {
            this.get('closeFoldersInputs').closeAllInputs();
            this.folder.set('isEdit', true);
            this.set('errors', null);
        },

        /**
         * Close Edit folder form
         * Reset the related data including data that users are modifying
         */
        cancelEdit() {
            this.set('isManage', false);
            this.folder.set('isEdit', false);
            this.get('folder').rollbackAttributes();
        },

        /**
         * Update folder
         */
        save() {
            $('#loading').show();
            let folder = this.get('folder');
            folder.save()
                .then(() => {
                    this.folder.set('isEdit', false);
                    this.get('growl').notice('Success', 'Folder updated');
                    this.onUpdateFolder();
                    $('#loading').hide();
                })
                .catch((adapterError) => {
                    let errors = this.get('growl').errorsDatabaseToArray(adapterError);
                    this.set('errors', errors);
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                    $('#loading').hide();
                });
        },
    }
});
