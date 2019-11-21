/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';
import formValidation from '../../mixins/form/form-validation';
import $ from 'jquery';

export default Component.extend(formValidation, {
    store: inject('store'),
    session: inject('session'),
    intl: inject('intl'),
    growl: inject('growl'),
    router: inject('router'),
    // Password variables to be used by Change profile
    actual_password: null,
    newpass: null,
    repeatnewpass: null,

    init() {
        this._super(...arguments);
        // Language options
        this.userLanguages = [
            {
                value: 'en',
                text: 'English'
            },
            {
                value: 'it',
                text: 'Italiano'
            }
        ];
    },
    /**
     * Reset password form's fields
     */
    resetPasswordForms() {
        this.get('user').rollbackAttributes();
        this.set('actual_password', null);
        this.set('newpass', null);
        this.set('repeatnewpass', null);
    },
    actions: {
        // cancelEdit

        /**
         * Exit editing User
         * Reset user data end related data
         */
        cancel() {
            this.set('isEdit', false);
            this.get('user').rollbackAttributes();

            this.set('actual_password', null);
            this.set('newpass', null);
            this.set('repeatnewpass', null);

            // reset errors data
            this.set('errors', null);
        },
        /**
         * Show Edit user form
         */
        showEdit() {
            this.set('isEdit', true);
            // reset errors data
            this.set('errors', null);
        },
        /**
         * Edit user
         */
        save() {
            window.loading.showLoading();
            let self = this;
            let user = this.get('user');
            user.set('actual_password', null);
            this.set('errors', null);

            if (this.get('isManageUsers')) {
                if (user.get('password') == '') {
                    user.set('password', undefined);
                }
            } else {
                let actual_password = this.get('actual_password');
                let newpass = this.get('newpass');
                let repeatnewpass = this.get('repeatnewpass');

                if ((newpass == '' || newpass == null) && (repeatnewpass == '' || repeatnewpass == null) && (actual_password == '' || actual_password == null)) {
                    user.set('password', undefined);
                    user.set('actual_password', undefined);
                }else{
                    user.set('password', newpass);
                    user.set('actual_password', actual_password);
                }
            }
            // set language
            user.set('language', $('select[name=language] option:selected').val());

            user.save()
                .then((userData) => {

                    // cancel Editing mode
                    if (this.get('isManageUsers')) {
                        this.send('cancel');
                    }

                    var userId = jwtDecode(self.get('session.session.content.authenticated.token'));

                    // If user edit him/her self
                    if (userId.sub == parseInt(userData.id, 10)) {
                        if (!userData.get('enabled')) {
                            this.get('session').invalidate();
                        } else {
                            //Update language
                            this.set('intl.locale', user.get('language'));
                            // Update token
                            if (userData.get('token') !== undefined && userData.get('token') !== '') {
                                this.set('session.data.authenticated.token', userData.get('token'));
                            }
                            let sessionData = self.get('session.data');
                            self.get('session.store').persist(sessionData);
                        }
                    }

                    this.resetPasswordForms();
                    this.get('growl').notice('Success', 'User updated');
                    window.loading.hideLoading();
                    // Redirect user to login page in case that the user token became unvalid
                    if (userData.get('forceLogin') !== undefined && userData.get('forceLogin')) {
                        $('#forceLogoutModal').modal('show');
                    }
                })
                .catch(adapterError => {
                    this.resetPasswordForms();
                    let errors = this.get('growl').errorsDatabaseToArray(adapterError);
                    this.set('errors', errors);
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                    window.loading.hideLoading();
                });
        },
        /**
         * Delete password related error messages 
         * on changing password inputs
         */
        onPasswordChange(type) {
            if (this.get('errors') !== undefined && this.get('errors') !== null && this.get('errors')[type] !== undefined) {
                delete this.get('errors')[type];
                if (Object.keys(this.get('errors')).length == 0) {
                    this.set('errors', null);
                }
            }
        },
        /**
         * close Force to login modal
         * redirect to login page because useer token became unvalid
         */
        CloseForceLogoutModal() {
            this.get('session').invalidate();
        },
        /**
         * How to handle printed value of select
         */
        printSelectValuesHandle(userLanguage) {
            return userLanguage.text
        }
    }
});
