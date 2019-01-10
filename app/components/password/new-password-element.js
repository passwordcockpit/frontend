/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';
import ENV from './../../config/environment';

export default Component.extend({
    router: inject('router'),
    session: inject('session'),
    store: inject('store'),
    growl: inject('growl'),

    icons: ENV.passwordFormConfig.icons,
    options: ENV.passwordFormConfig.options,
    
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
         * Create new password
         * Notify to new-password about the operation
         * 
         * @param {*} folderId 
         */
        submit(folderId) {
            $('#loading').show();
            // reset errors data
            this.set('errors', null);

            let self = this;
            let file = $('#file')[0].files[0]
            var fd = new FormData();
            fd.append("folder_id", folderId);
            if (this.get('title')) {
                fd.append("title", this.get('title'));
            }
            if (this.get('icon')) {
                fd.append("icon", this.get('icon'));
            }
            if (this.get('description')) {
                fd.append("description", this.get('description'));
            }
            if (this.get('username')) {
                fd.append("username", this.get('username'));
            }
            if (this.get('password')) {
                fd.append("password", this.get('password'));
            }
            if (this.get('url')) {
                fd.append("url", this.get('url'));
            }
            if (this.get('tags')) {
                fd.append("tags", this.get('tags'));
            }
            if (file) {
                fd.append("file", file);
            }

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
                $('#loading').hide();
                self.get('router').transitionTo('folders.folder.passwords.password', success.password_id);
            }).catch(adapterError => {
                let errors = this.get('growl').errorsDatabaseToArray(adapterError);
                this.set('errors', errors);
                $('#loading').hide();
                self.get('growl').error('Error', 'Error while creating the password');
            });


        }
    }
});
