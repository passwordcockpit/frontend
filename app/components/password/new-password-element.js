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

export default Component.extend(formValidation, {
    router: inject('router'),
    session: inject('session'),
    store: inject('store'),
    growl: inject('growl'),
    passwordEncrypt: inject('password-encrypt'),
    icons: ENV.passwordFormConfig.icons,
    options: ENV.passwordFormConfig.options,

    init(){
        this._super(...arguments);
        // set default icon as key
        this.set('icon', 'key');
    },
    didRender(){
        // init bootstrap tooltip
        $('[data-toggle="tooltip"]').tooltip();
    },
    actions: {
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

            let newPassword = $.pGenerator({
                'passwordLength': passwordLength,
                'uppercase': uppercase, 
                'lowercase': lowercase,
                'numbers': numbers,
                'specialChars': specialchars
            });

            // update password
            this.set('password', newPassword);
        },

        /**
         * Create new password
         * Notify to new-password about the operation
         * 
         */
        save() {
            window.loading.showLoading();
            let folderId = this.folderId;
            // reset errors data
            this.set('errors', null);

            let self = this;
            let file = $('#file')[0].files[0]
            var fd = new FormData();
            let isFormValid = true;
            fd.append("folder_id", folderId);
            if (this.title) {
                fd.append("title", this.title);
            }
            if (this.icon) {
                fd.append("icon", this.icon);
            }
            if (this.description) {
                fd.append("description", this.description);
            }
            if (this.username) {
                fd.append("username", this.username);
            }

            if (this.url) {
                fd.append("url", this.url);
            }
            if (this.tags) {
                fd.append("tags", this.tags);
            }
            // plain password
            if (this.password && !this.frontendCrypted) {
                fd.append("password", this.password);
            }
            // password with pin encryption
            if (this.frontendCrypted) {
                fd.append("frontendCrypted", this.frontendCrypted);
                fd.append("password", this.passwordEncrypt.encryptPassword(this.pin, this.password));
            }
            if (file) {
                fd.append("file", file);
            }
            if (isFormValid) {
                $.ajax({
                    url:
                        window.APP.host +
                        "/" +
                        window.APP.namespace +
                        "/passwords",
                    data: fd,
                    headers: {
                        Authorization:
                            "Bearer " + self.get("session.session.content.authenticated.token")
                    },
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: "POST"
                }).done(success => {
                    // Add new file to the store
                    success.id = success.password_id;
                    self.get('store').createRecord('password', success);
                    self.onCreatePassword();
                    self.get('growl').notice('Success', 'Password created');
                    window.loading.hideLoading();
                    self.get('router').transitionTo('folders.folder.passwords.password', success.password_id);
                }).fail(adapterError => {
                    let errors = this.growl.errorsDatabaseToArray(adapterError);
                    this.set('errors', errors);
                    window.loading.hideLoading();
                    self.get('growl').error('Error', 'Error while creating the password');
                });
            } else {
                window.loading.hideLoading();
            }

        },
        /**
         * reset frontendCrypted if password empty
         * 
         */
        resetPin() {
            if (!this.password) {
                this.set('frontendCrypted', false)
            }
        },
    }
});
