/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller, { inject as controller } from '@ember/controller';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({
    store: inject('store'),
    folderController: controller('folders.folder'),
    growl: inject('growl'),
    actions: {
        /**
         * Is called by password-contents on deleting the password
         * 
         * @param {*} passwordId 
         */
        onDeletePassword(passwordId) {
            window.loading.showLoading();
            let password = this.store.peekRecord('password', passwordId);
            let folderId = password.data.folder_id
            password.destroyRecord()
                .then(() => {
                    $('#deletePasswordConfirm').modal('hide');
                    window.loading.hideLoading();
                    this.folderController.send('onUpdatePassword');

                    this.growl.notice('Success', 'Password deleted');

                    this.transitionToRoute('folders.folder', folderId);
                })
                .catch((adapterError) => {
                    $('#deletePasswordConfirm').modal('hide');
                    window.loading.hideLoading();
                    $('.modal-dialog').hide();
                    this.growl.errorShowRaw(adapterError.title, adapterError.message);
                });
        },
        /**
         * Is called by password-contents on updating the password
         * 
         * @param {*} passwordId 
         */
        onSavePassword(passwordId) {
            this.folderController.send('onUpdatePassword');
            if (this.canViewLogs) {
                this.send('refreshLog', passwordId);
            }
        },

        /**
         * Refresh password Log's content based on current page
         * 
         * @param {*} passwordId 
         */
        refreshLog(passwordId) {

            let page = this.page;
            let self = this
            window.loading.showLoading();
            this.store.query('log', { passwordId: passwordId, page: page }).then((logs) => {
                self.get('store').peekAll('log').forEach((storedLog) => {
                    let found = false;
                    logs.forEach((responseLog) => {
                        if (storedLog.id == responseLog.id) {
                            found = true;
                        }
                    });
                    if (!found) {
                        self.get('store').unloadRecord(storedLog);
                    }
                });
                logs.forEach(function (log) {
                    log.set('userName', self.get('store').peekRecord('user', log.get('user_id')).get('username'));
                });
                self.set('page', page);
                self.set('pageCount', logs.get('meta')._page_count);
                self.set('logs', logs);
                window.loading.hideLoading();
            }).catch((adapterError) => {
                window.loading.hideLoading();
                this.growl.errorShowRaw(adapterError.title, adapterError.message);
            });
        },

        /**
         * Set current Log's page
         * 
         * @param {*} page - page number 
         */
        changeLogPage(page) {
            this.set('page', page);
        }
    }
});
