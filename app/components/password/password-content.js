/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';
import ENV from './../../config/environment';

export default Component.extend({
    store: inject('store'),
    session: inject('session'),
    growl: inject('growl'),
    intl: inject('intl'),
    passwordEncrypt: inject('password-encrypt'),
    localTempPassword: null,
    icons: ENV.passwordFormConfig.icons,
    options: ENV.passwordFormConfig.options,
    pinEncrypt: null,
    localTempPasswordDecrypted: null,
    failureLimit: ENV.passwordEncryptionConfig.failureLimit,

    actions: {
        /**
         * Toggle Password's visibility
         */
        togglePasswordVisibility() {
            this.toggleProperty('isPasswordVisible');
        },

        /**
         * Show edit Password form
         * Store before-editing Password data
         */
        editPassword() {
            this.set('isEdit', true);
            this.set('localTempPassword', this.get('password').serialize());
            this.set('localTempPasswordDecrypted', this.get('passwordDecrypted'));
        },
        /**
         * Cancel editing Password
         * Reset Password data using stored data
         */
        cancel() {
            this.set('isEdit', false);

            let self = this;
            // Reset password data
            Object.keys(this.localTempPassword).forEach(function (key) {
                self.get('password').set(key, self.localTempPassword[key]);
            });
            this.set('passwordDecrypted', this.get('localTempPasswordDecrypted'));
            // reset errors data
            this.set('errors', null);

            // protect password
            this.set('pinDecrypt', null);
            this.set('isPinValid', false);
        },

        // Generate password functions
        /**
         * Is called on Random-password's refresh button clicking
         */
        refreshPassword() {
            this.send('GeneratorPassword');
        },
        /**
         * Show Random-password Options' panel
         */
        showPasswordGeneratorOption() {
            $('.password-options-form').slideDown();
        },
        /**
         * Close Random-password Options' panel
         */
        showPasswordGeneratorOptionClose() {
            $('.password-options-form').slideUp();
        },
        /**
         * Reset Random-password Options
         */
        ResetPasswordGenerator() {
            $('input[name="password-length"]').val('8');
            $('input[name="uppercase"]').prop('checked', true);
            $('input[name="lowercase"]').prop('checked', true);
            $('input[name="numbers"]').prop('checked', true);
            $('input[name="specialchars"]').prop('checked', false);
        },
        /**
         * Generate and put new Random-password into Password input
         */
        GeneratorPassword() {
            var passwordLength = 8;
            var uppercase = false;
            var lowercase = false;
            var numbers = false;
            var specialchars = false;
            if ($('input[name="password-length"]').val() > 0) {
                passwordLength = $('input[name="password-length"]').val();
            }
            if ($('input[name="uppercase"]').is(':checked')) {
                uppercase = true;
            }
            if ($('input[name="lowercase"]').is(':checked')) {
                lowercase = true;
            }
            if ($('input[name="numbers"]').is(':checked')) {
                numbers = true;
            }
            if ($('input[name="specialchars"]').is(':checked')) {
                specialchars = true;
            }

            $('.password-generator').pGenerator({
                'passwordElement': 'input[name="password"]',
                'passwordLength': passwordLength,
                'uppercase': uppercase,
                'lowercase': lowercase,
                'numbers': numbers,
                'specialChars': specialchars
            });

            var input = document.getElementById('passwordEdit');
            input.focus();
            input.select();
        },

        /**
         * Highlight password
         */
        selectPassword() {
            let sel, range;
            let el = $('#password-read')[0];
            if (window.getSelection && document.createRange) { //Browser compatibility
                sel = window.getSelection();
                if (sel.toString() == '') { //no text selection
                    window.setTimeout(function () {
                        range = document.createRange(); //range object
                        range.selectNodeContents(el); //sets Range
                        sel.removeAllRanges(); //remove all ranges from selection
                        sel.addRange(range);//add Range to a Selection.
                    }, 1);
                }
            } else if (document.selection) { //older ie
                sel = document.selection.createRange();
                if (sel.text == '') { //no text selection
                    range = document.body.createTextRange();//Creates TextRange object
                    range.moveToElementText(el);//sets Range
                    range.select(); //make selection.
                }
            }
        },

        // delete password functions
        /**
         * Show Delete password confirmation dialog box
         */
        showConfirm() {
            $('#deletePasswordConfirm').modal('show');
        },
        /**
         * close Delete password confirmation dialog box
         */
        cancelFormConfirm() {
            $('#deletePasswordConfirm').modal('hide');
        },
        /**
         * Confirm the password's deletion
         * Notify to passwords (controller) to delete password
         * 
         * @param {*} passwordId 
         */
        deletePassword(passwordId) {
            $('#deletePasswordConfirm').modal('hide');
            this.onDeletePassword(passwordId);
        },

        // Password's file functions
        /**
         * Download password's file
         */
        downloadPasswordFile() {
            let self = this;
            let fileName = this.password.get('fileName');
            let url =
                window.APP.host +
                "/" +
                window.APP.namespace +
                "/upload/files/" +
                this.password.get('fileId')
                ;
            fetch(url, {
                method: "get",
                headers: {
                    Authorization:
                        "Bearer " + self.get("session.session.content.authenticated.token")
                }
            }).then(res => {
                return res.blob();
            }).then(res => {
                /*global saveAs */
                saveAs(res, fileName);
            });
        },
        /**
         * Delete password's file
         */
        deletePasswordFile() {
            $('#deleteFilePermissionConfirm').modal('hide');
            $('#loading').show();
            let self = this;

            $.ajax({
                url: window.APP.host + '/' + window.APP.namespace + '/files/' + this.password.get('fileId'),
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": "application/json",
                    "Authorization": "Bearer " + self.get("session.session.content.authenticated.token")
                }
            }).done(() => {
                // Update password of deleting-file's data
                let dataPassword = self.get('store').peekRecord('password', self.password.get('id'));
                dataPassword.set('fileId', null);
                dataPassword.set('fileName', null);

                self.set('password', dataPassword);
                self.set('localTempPassword', self.get('password').serialize());

                $('#loading').hide();
                self.get('growl').notice('Success', 'File deleted');
            }).fail((adapterError) => {
                $('#loading').hide();
                this.get('growl').errorShowRaw(adapterError.responseJSON.title, adapterError.responseJSON.detail);
            });
        },
        /**
         * Show Delete password's file confirmation dialog box
         */
        showDeleteFileConfirm() {
            $('#deleteFilePermissionConfirm').modal('show');
        },
        /**
         * Close Delete password's file confirmation dialog box
         */
        cancelDeleteFileConfirm() {
            $('#deleteFilePermissionConfirm').modal('hide');
        },
        /**
         * Update password
         * Notify to passwords (controller) about the operation
         */
        submit() {
            $('#loading').show();
            // reset errors data
            this.set('errors', null);
            // protect password
            this.set('pinDecrypt', null);
            this.set('isPinValid', false);

            let password = this.get('password');
            if (this.localTempPassword.icon != null && password.get('icon') == null) {
                password.set('icon', '');
            }
            let self = this;

            password.save()
                .then(() => {
                    // upload file
                    if ($('#file')[0] && $('#file')[0].files[0]) {

                        var fd = new FormData();
                        let file = $('#file')[0].files[0];
                        fd.append("file", file);
                        $.ajax({
                            url:
                                window.APP.host +
                                "/" +
                                window.APP.namespace +
                                "/passwords/" +
                                self.password.id +
                                "/files"
                            ,
                            data: fd,
                            headers: {
                                Authorization:
                                    "Bearer " + self.get("session.session.content.authenticated.token")
                            },
                            cache: false,
                            contentType: false,
                            processData: false,
                            type: "POST"
                        }).done(fileCreatedResult => {
                            let passwordData = this.get('store').peekRecord('password', fileCreatedResult.password_id);
                            passwordData.set('fileId', fileCreatedResult.file_id);
                            passwordData.set('fileName', fileCreatedResult.name);
                            this.set('password', this.get('store').peekRecord('password', fileCreatedResult.password_id));

                            this.set('isEdit', false);

                            $('#loading').hide();
                            this.get('growl').notice('Success', 'File uploaded');
                        }).fail(adapterError => {
                            this.set('isEdit', false);
                            $('#loading').hide();
                            this.get('growl').errorShowRaw(adapterError.responseJSON.title, adapterError.responseJSON.detail);
                        });
                    } else {
                        this.set('isEdit', false);
                    }
                    this.onSavePassword(self.password.id);
                    this.get('growl').notice('Success', 'Password updated');
                })
                .catch((adapterError) => {
                    let errors = this.get('growl').errorsDatabaseToArray(adapterError);
                    this.set('errors', errors);
                    $('#loading').hide();
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                });
        },

        // Descrypt/Encrypt password funtions
        /**
         * descrypt password.password
         */
        desryptPassword() {
            if (this.get('passwordEncrypt').decryptPassword(this.get('pinDecrypt'), this.get('password.password'))) {
                // decrypt password for edit read password
                this.set('passwordDecrypted', this.get('passwordEncrypt').decryptPassword(this.get('pinDecrypt'), this.get('password.password')));
                // fill the pin field for edit password
                this.set('pinEncrypt', this.get('pinDecrypt'));

                this.set('isPinValid', true);
                this.set('failureCounted', 0);
                return
            }

            this.set('failureCounted', this.get('failureCounted') + 1);
            this.get('growl').error('Error', 'Wrong PIN');
            this.set('passwordDescryptionBlocked', (this.get('failureCounted') >= this.get('failureLimit')));
            this.set('isPinValid', false);
        },
        /**
         * Lock password on pinDecrypt changing
         */
        protectPassword() {
            this.set('isPinValid', false);
        },
        /**
        * reset usePin if password empty
        * 
        */
        resetPin() {
            if (!this.get('passwordDecrypted')) {
                this.set('password.usePin', false)
            }
            this.send('setPassword');
        },
        /**
        * set password.password (with/without PIN)
        * 
        */
        setPassword(toggleUsePin) {
            if (toggleUsePin) {
                this.set('password.usePin', !this.get('password.usePin'))
            }
            if (this.get('isEdit')) {
                if (this.get('password.usePin')) {
                    // with PIN
                    let passwordEncrypted = this.get('passwordEncrypt').encryptPassword(this.get('pinEncrypt'), this.get('passwordDecrypted'));
                    this.set('password.password', passwordEncrypted);
                    this.set('pinDecrypt', this.get('pinEncrypt'));
                } else {
                    // without PIN
                    this.set('password.password', this.get('passwordDecrypted'));
                    this.set('pinEncrypt', null);
                }
            }
        },
    }
});
