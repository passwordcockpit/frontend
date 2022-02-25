/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller, { inject as controller } from '@ember/controller';
import { inject } from '@ember/service';
import $ from 'jquery';
import RSVP from 'rsvp';

export default Controller.extend({
    foldersController: controller('folders'),
    folderController: controller('folders.folder'),
    isAdd: false,
    // Show Folder list option for mobile mode
    showList: true,
    growl: inject('growl'),
    session: inject('session'),
    closeFoldersInputs: inject('close-folders-inputs'),

    searchResults: null,
    /**
     * Retrieve the list of folders starting from the child folder
     */
    retrieveParentFolders: function (firstParentFolderId) {
        let folderPath = [];
        let parentId = firstParentFolderId;
        while (parentId != null) {
            let parentFolderData = this.store.peekRecord('folder', parentId);
            folderPath.push(parentFolderData.get('name'));
            parentId = parentFolderData.get('parent_id');
        }
        return folderPath.reverse();
    },
    /**
     * Transforming data found from Searching (Folder data) into a suitable format
     * which can be used by template
     */
    buildSearchFoldersResult(folders, result) {
        if (result == undefined) {
            result = [];
        }
        let self = this;
        folders.forEach(function (folder) {
            let folderId = folder.id;
            let folderName = folder.data.name;
            let folderAccess = folder.data.access;
            let folderPath = [];
            let folderPathToString = '/';
            let parentId = folder.data.parent_id;
            if (parentId) {
                folderPath = self.get('retrieveParentFolders').call(self, parentId);

                folderPathToString = folderPath.join(' / ');
            }

            result.push({
                valueToSort: [folderPathToString, 0, folderName],   // 1 stands for isFolder, meaning that password (0) with the same path will be printed first
                folderId: folderId,
                folderName: folderName,
                folderAccess: folderAccess,
                folderPath: folderPath,
                folderPathToString: folderPathToString,
                isFolder: true
            });
        });
        return result;
    },
    /**
     * Transforming data found from Searching (Password data) into a suitable format
     * which can be used by template
     */
    buildSearchPasswordsResult(passwords, result) {
        if (result == undefined) {
            result = [];
        }
        let self = this;
        passwords.forEach(function (password) {
            let passwordId = password.id;
            let passwordTitle = password.data.title;
            let passwordPath = [];
            let passwordPathToString = '/';
            let parentId = password.data.folder_id;
            passwordPath = self.get('retrieveParentFolders').call(self, parentId);
            passwordPathToString = passwordPath.join(' / ');
            let icon = password.data.icon;

            result.push({
                valueToSort: [passwordPath, 1, passwordTitle],
                passwordId: passwordId,
                passwordTitle: passwordTitle,
                folderId: parentId,
                passwordPath: passwordPath,
                passwordPathToString: passwordPathToString,
                isFolder: false,
                icon: icon
            });
        });
        return result;

    },
    actions: {

        removePassword(passwordId) {
            this.folderController.send('removePassword', passwordId);
        },
        /**
         * Toggle folders list visibility (only for mobile)
         */
        showFoldersList() {
            this.set('showList', true);
        },
        hideFoldersList() {
            this.set('showList', false);
        },
        /**
         * Interactive show/hile folder
         * @param {*} folder 
         */
        slideAllUp() {
            this.indexedFolders.forEach(function (folder) {
                folder.set('isShow', false);
            });
            $('div[data-id^=collapse]').slideUp();
            // Show collapsed folders tree for mobile
            this.send('showFoldersList');
        },
        slideAllDown() {
            this.indexedFolders.forEach(function (folder) {
                folder.set('isShow', true);
            });
            $('div[data-id^=collapse]').slideDown();
            // Show collapsed folders tree for mobile
            this.send('showFoldersList');
        },
        slideUp(folder) {
            folder.set('isShow', false);
            $('[data-id=collapse-' + folder.id + ']').slideUp();
        },
        slideDown(folder) {
            folder.set('isShow', true);
            $('[data-id=collapse-' + folder.id + ']').slideDown();
        },
        collapseFolder(folder) {
            // this variable can be used to know if it is a slideUp or slideDown animation,
            // if folderVisible (before) is true => show folder's children
            let folderVisible = !folder.isShow;
            if (folderVisible) {
                this.foldersController.send('slideDown', folder);
            } else {
                this.foldersController.send('slideUp', folder);
            }

        },
        /**
         * Show New ROOT-folder's form
         * Close the other opened inputs
         */
        addFolder() {
            this.closeFoldersInputs.closeAllInputs();
            this.set('isAdd', true);
            this.send('showFoldersList');
        },
        /**
         * Close New ROOT-folder's form
         */
        cancelAddFolder() {
            this.set('isAdd', false);
        },
        /**
         * Build/Rebuild Folders list
         * as a result: Folders list will be updated
         * 
         * @param {*} params 
         */
        buildTree(params) {
            let childs = [];
            let roots = [];
            let indexedFolders = [];
            // Create the tree structure
            params.folders.forEach(function (folder) {
                // Retrieve parameters
                let folderId = folder.id;
                let parentId = folder.data.parent_id;

                // Add the folder to the indexed array
                indexedFolders[folderId] = folder;

                // Check the parent node
                if (parentId) {
                    if (childs[parentId] != undefined) {
                        // Update the parent node
                        childs[parentId].push(folderId);
                    } else {
                        // Create the parent node
                        childs[parentId] = [folderId];
                    }
                } else {
                    roots.push(folderId);
                }
            });
            this.set('roots', roots);
            this.set('tree', childs);
            this.set('indexedFolders', indexedFolders);
        },
        /**
         * Update folders list
         * Is called by new-folder-element on creating new Folder
         * 
         * @param {*} folderId 
         */
        onCreateFolder(folderId) {
            window.loading.showLoading();
            this.store.query("folder", {})
                .then((results) => {
                    // Rebuild the tree
                    this.send('buildTree', { folders: results });

                    // Open the recently created folder
                    this.transitionToRoute('folders.folder', folderId);
                    window.loading.hideLoading();
                })
                .catch(() => {
                    this.growl.error('Error', 'Error while retrieving folders');
                    window.loading.hideLoading();
                });
        },
        /**
         * Update folders list
         * Is called by folder-element on updating Folder
         */
        onUpdateFolder() {
            this.store.query("folder", {})
                .then((results) => {
                    // Rebuild the tree
                    this.send('buildTree', { folders: results });
                })
                .catch(() => {
                    this.growl.error('Error', 'Error while retrieving folders');
                });
        },
        /**
         * Delete folder and Update folders list
         * Is called by folder-element on deleting Folder
         * 
         * @param {*} folderId 
         */
        onDeleteFolder(folderId) {
            window.loading.showLoading();
            $('#deleteFolderConfirm' + folderId).modal('hide');

            $.ajax({
                url: window.APP.host + '/' + window.APP.namespace + '/folders/' + folderId,
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": "application/json",
                    "Authorization": "Bearer " + this.get('session.data.authenticated.token')
                }
            }).done(() => {
                this.growl.notice('Success', 'Folder deleted');
                //  Recreate the tree
                this.store.query("folder", {})
                    .then((results) => {
                        // Rebuild the tree
                        this.send('buildTree', { folders: results });
                        window.loading.hideLoading();
                    })
                    .catch(() => {
                        window.loading.hideLoading();
                        $('#deleteFolderConfirm' + folderId).modal('hide');
                        this.growl.error('Error', 'Error while retrieving folders');
                    });

                // redirect to "folders" if current select forlder is the one deleted
                if (this.transitionData.params['folders.folder'] != undefined) {
                    let transitionFolderId = this.transitionData.params['folders.folder'].folder_id;
                    if (transitionFolderId == folderId) {
                        this.transitionToRoute('folders');
                    }
                }
            }).fail((adapterError) => {
                window.loading.hideLoading();
                this.growl.errorShowRaw(adapterError.responseJSON.title, adapterError.responseJSON.detail);
            });

        },
        /**
         * Update folder list
         * Is called by folder-user on updating/deleting permission
         */
        onUpdatePemission() {
            this.store.query("folder", {})
                .then((results) => {
                    // Rebuild the tree
                    this.send('buildTree', { folders: results });
                })
                .catch(() => {
                    this.growl.error('Error', 'Error while retrieving folders');
                });
        },
        /**
         * Submit search
         */
        searchSubmit() {
            window.loading.showLoading();
            let keywords = $('#search-keywords').val();
            let target = $('#search-target').val();

            let result = {
                target: target
            };

            if (target === 'Folder' || target === 'All') {
                result.folders = this.store.query('folder', { q: keywords })
            }
            if (target === 'Password' || target === 'All') {
                result.passwords = this.store.query('password', { q: keywords })
            }

            return RSVP.hash(result).then((hash) => {
                let resultsSearch = [];
                if (hash.target === 'Folder' || hash.target === 'All') {
                    resultsSearch = this.buildSearchFoldersResult.call(this, hash.folders, resultsSearch);
                }
                if (hash.target === 'Password' || hash.target === 'All') {
                    resultsSearch = this.buildSearchPasswordsResult.call(this, hash.passwords, resultsSearch);
                }

                resultsSearch = resultsSearch.sort(function (a, b) {
                    let arrayLength = a.valueToSort.length < b.valueToSort.length ? a.valueToSort.length : b.valueToSort.length;
                    for (let i = 0; i < arrayLength; i++) {
                        if (a.valueToSort[i].toString().toLowerCase() < b.valueToSort[i].toString().toLowerCase()) {
                            return -1;
                        }
                        else if (b.valueToSort[i].toString().toLowerCase() < a.valueToSort[i].toString().toLowerCase()) {
                            return 1;
                        }
                    }
                    return 0;
                });

                this.set('searchResults', {
                    results: resultsSearch,
                    hasResults: true,
                    target: hash.target
                })

                window.loading.hideLoading();
                return resultsSearch;
            }).catch((adapterError) => {
                window.loading.hideLoading();

                if (adapterError.hasOwnProperty('code')) {
                    this.growl.errorShowRaw(adapterError.title, adapterError.message);
                }
            });
        },

        /**
         * Transition to the page of the selected result' folder
         * 
         * @param {*} route 
         * @param {*} folderId 
         * @param {*} passwordId 
         */
        onSelectSearchFolderElement(folderId) {
            this.set('searchResults', null);
            this.transitionToRoute('folders.folder', folderId);
        },
        /**
         * Transition to the page of the selected result's password 
         * 
         * @param {*} route 
         * @param {*} folderId 
         * @param {*} passwordId 
         */
        onSelectSearchPasswordElement(folderId, passwordId) {
            this.set('searchResults', null);
            this.transitionToRoute('folders.folder.passwords.password', folderId, passwordId);
        },
        /**
         * Close search results
         */
        cancelSearch() {
            this.set('searchResults', null);
        }
    }
});
