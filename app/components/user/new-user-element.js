/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
    router: inject('router'),
    store: inject('store'),
    growl: inject('growl'),
    errors: null,

    actions: {
        /**
         * Create new userusers (controller)
         * Notify to users (passing by new-users) about the operation
         */
        submit() {
            $('#loading').show();
            let newUserRecord = this.get('store')
                .createRecord('user', {
                    username: this.get('username'),
                    password: this.get('password'),
                    name: this.get('name'),
                    surname: this.get('surname'),
                    phone: this.get('phone'),
                    email: this.get('email'),
                    enabled: this.get('enabled') ? true : false,
                    language: $('select[name=language] option:selected').val()
                });
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
        }
    }
});
