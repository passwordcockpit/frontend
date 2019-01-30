/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import formValidation from '../../mixins/form/form-validation';
import $ from 'jquery';

export default Component.extend(formValidation, {
    router: inject('router'),
    store: inject('store'),
    growl: inject('growl'),
    errors: null,
    language: '',
    // Language options
    userLanguage:[
        {
            value: '',
            text: '-'
        },
        {
            value: 'en',
            text: 'English'
        },
        {
            value: 'it',
            text: 'Italiano'
        }
    ],
    actions: {
        /**
         * Create new userusers (controller)
         * Notify to users (passing by new-users) about the operation
         */
        save() {
            $('#loading').show();
            let newUserRecord = this.get('store')
                .createRecord('user', {
                    username: this.get('username'),
                    name: this.get('name'),
                    surname: this.get('surname'),
                    phone: this.get('phone'),
                    email: this.get('email'),
                    enabled: this.get('enabled') ? true : false,
                    language: $('select[name=language] option:selected').val()
                });
                if(this.get('password')!==undefined && this.get('password')!=''){
                    newUserRecord.set('password', this.get('password'));
                }
            newUserRecord.save()
                .then((result) => {
                    this.onCreateUser();
                    $('#loading').hide();
                    this.get('growl').notice('Success', 'User created');
                    this.get('router').transitionTo('users.user', result.get('id'));
                })
                .catch((adapterError) => {
                    newUserRecord.deleteRecord();

                    let errors = this.get('growl').errorsDatabaseToArray(adapterError);
                    this.set('errors', errors);
                    $('#loading').hide();
                    this.get('growl').errorShowRaw(adapterError.title, adapterError.message);
                });
        },
        /**
         * How to handle printed value of select
         */
        printSelectValuesHandle(userLanguage) {
            return userLanguage.text;
        }
    }
});
