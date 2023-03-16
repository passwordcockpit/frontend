/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import ENV from './../../config/environment';
import formValidation from '../../mixins/form/form-validation';
import $ from 'jquery';
import { htmlSafe } from '@ember/template'

export default Component.extend(formValidation, {
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
    passwordDescritpion: Ember.computed('password.description', function() {
        return Ember.String.htmlSafe(this.get('password.description'));
    }),

    didRender(){
        // init bootstrap tooltip
        $('[data-toggle="tooltip"]').tooltip();

        if (this.password && this.password.id) {
            console.log('redirect)', this.password)
            window.history.replaceState( {} , `folders`, `/folders/${this.password.folder_id}/passwords/${this.password.id}`)
        }
    },

    copyStringToClipboard (str) {
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
        // show growl success notification
        this.growl.notice('Success','Copied to clipboard');
    },

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
            this.set('localTempPassword', this.password.serialize());
            this.set('localTempPasswordDecrypted', this.passwordDecrypted);
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
            this.set('passwordDecrypted', this.localTempPasswordDecrypted);
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
            if ($('input[name="password-length"]').val() > 0 && $('input[name="password-length"]').val() <= 100) {
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

            let newPassword = $.pGenerator({
                'passwordLength': passwordLength,
                'uppercase': uppercase,
                'lowercase': lowercase,
                'numbers': numbers,
                'specialChars': specialchars
            });
            // update password
            this.set('passwordDecrypted', newPassword);
            this.send('setPassword', false);
        },

        /**
         * Highlight password and copy it in clipboard
         * * @param {*} password 
         */
        selectPassword(password) {
            let sel, range;
            let el = $('#password-read')[0];
            if (window.getSelection && document.createRange) { //Browser compatibility
                sel = window.getSelection();
                this.copyStringToClipboard(password);
                
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
                this.copyStringToClipboard(password);
                if (sel.text == '') { //no text selection
                    range = document.body.createTextRange();//Creates TextRange object
                    range.moveToElementText(el);//sets Range
                    range.select(); //make selection.
                }
            }
        },

        /**
         * Highlight username and copy it in clipboard
         * @param {*} username 
         */
        selectUsername(username){
            let sel, range;
            let el = $('#username-read')[0];
            if (window.getSelection && document.createRange) { //Browser compatibility
                sel = window.getSelection();
                this.copyStringToClipboard(username);
                
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
                this.copyStringToClipboard(username);
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
            window.loading.showLoading();
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

                window.loading.hideLoading();
                self.get('growl').notice('Success', 'File deleted');
            }).fail((adapterError) => {
                window.loading.hideLoading();
                this.growl.errorShowRaw(adapterError.responseJSON.title, adapterError.responseJSON.detail);
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
        save() {
            window.loading.showLoading();
            // reset errors data
            this.set('errors', null);
            // protect password
            this.set('pinDecrypt', null);
            this.set('isPinValid', false);

            let password = this.password;
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
                            let passwordData = this.store.peekRecord('password', fileCreatedResult.password_id);
                            passwordData.set('fileId', fileCreatedResult.file_id);
                            passwordData.set('fileName', fileCreatedResult.name);
                            this.set('password', this.store.peekRecord('password', fileCreatedResult.password_id));

                            this.set('isEdit', false);

                            window.loading.hideLoading();
                            this.growl.notice('Success', 'File uploaded');
                        }).fail(adapterError => {
                            this.set('isEdit', false);
                            window.loading.hideLoading();
                            this.growl.errorShowRaw(adapterError.responseJSON.title, adapterError.responseJSON.detail);
                        });
                    } else {
                        window.loading.hideLoading();
                        this.set('isEdit', false);
                    }
                    this.onSavePassword(self.password.id);
                    this.growl.notice('Success', 'Password updated');
                })
                .catch((adapterError) => {
                    let errors = this.growl.errorsDatabaseToArray(adapterError);
                    this.set('errors', errors);
                    window.loading.hideLoading();
                    this.growl.errorShowRaw(adapterError.title, adapterError.message);
                });
        },

        // Descrypt/Encrypt password funtions
        /**
         * descrypt password.password
         */
        decryptPassword() {
            if (this.passwordEncrypt.decryptPassword(this.pinDecrypt, this.get('password.password'))) {
                // decrypt password for edit read password
                this.set('passwordDecrypted', this.passwordEncrypt.decryptPassword(this.pinDecrypt, this.get('password.password')));
                // fill the pin field for edit password
                this.set('pinEncrypt', this.pinDecrypt);

                this.set('isPinValid', true);
                this.set('failureCounted', 0);
                return
            }

            this.set('failureCounted', this.failureCounted + 1);
            this.growl.error('Error', 'Wrong PIN');
            this.set('passwordDescryptionBlocked', (this.failureCounted >= this.failureLimit));
            this.set('isPinValid', false);
        },
        /**
         * Lock password on pinDecrypt changing
         */
        protectPassword(event) {
            if (event.keyCode !== 13) {
                this.set('isPinValid', false);
            }
        },
        /**
        * reset frontendCrypted if password empty
        * 
        */
        resetPin() {
            if (!this.passwordDecrypted) {
                this.set('password.frontendCrypted', false)
            }
            this.send('setPassword');
        },
        /**
        * set password.password (with/without PIN)
        * 
        * @param {boolean} toggleFrontendCrypted
        */
        setPassword(toggleFrontendCrypted) {
            if (toggleFrontendCrypted) {
                this.set('password.frontendCrypted', !this.get('password.frontendCrypted'))
            }
            if (this.isEdit) {
                if (this.get('password.frontendCrypted')) {
                    // with PIN
                    let passwordEncrypted = this.passwordEncrypt.encryptPassword(this.pinEncrypt, this.passwordDecrypted);
                    this.set('password.password', passwordEncrypted);
                    this.set('pinDecrypt', this.pinEncrypt);
                } else {
                    // without PIN
                    this.set('password.password', this.passwordDecrypted);
                    this.set('pinEncrypt', null);
                }
            }
        },
        /**
         * How to handle printed value of select
         */
        printSelectValuesHandle(icon) {
            return new htmlSafe('<i class="fas fa-' + icon + '"></i>');
        }
    }
});
