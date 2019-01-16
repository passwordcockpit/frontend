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
            $('#loading').show();
            let password = this.get('store').peekRecord('password', passwordId);
            let folderId = password.data.folder_id
            password.destroyRecord()
                .then(() => {
                    $('#deletePasswordConfirm').modal('hide');
                    $('#loading').hide();
                    this.get('folderController').send('onUpdatePassword');

                    this.get('growl').notice('Success', 'Password deleted');

                    this.transitionToRoute('folders.folder', folderId);
                })
                .catch((adapterError) => {
                    $('#deletePasswordConfirm').modal('hide');
                    $('#loading').hide();
                    $('.modal-dialog').hide();
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                });
        },
        /**
         * Is called by password-contents on updating the password
         * 
         * @param {*} passwordId 
         */
        onSavePassword(passwordId) {
            this.get('folderController').send('onUpdatePassword');
            if (this.get('canViewLogs')) {
                this.send('refreshLog', passwordId);
            }
        },

        /**
         * Refresh password Log's content based on current page
         * 
         * @param {*} passwordId 
         */
        refreshLog(passwordId) {

            let page = this.get('page');
            let self = this
            $('#loading').show();
            this.get('store').query('log', { passwordId: passwordId, page: page }).then((logs) => {
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
                $('#loading').hide();
            }).catch((adapterError) => {
                $('#loading').hide();
                this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
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
