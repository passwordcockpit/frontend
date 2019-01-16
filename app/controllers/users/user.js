/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Controller from '@ember/controller';
import jwtDecode from 'ember-cli-jwt-decode';
import { inject } from '@ember/service';

export default Controller.extend({
    session: inject('session'),
    growl: inject('growl'),
    actions: {
        /**
         * Reload logs data and canViewLog permission
         * Is called by user-rights on Editing permission
         * 
         * @param {*} userId 
         */
        onUpdateUserRight(userId) {
            let logedUserId = jwtDecode(this.get('session.data.authenticated.token')).sub;
            if (logedUserId == userId) {
                if (this.model.permission.get('view_logs') && !this.get('canViewLog')) {
                    this.get('store').query('userlog', { userId: userId, page: 1 })
                        .then((result) => {
                            this.set('logs', result);
                            this.set('canViewLog', this.model.permission.get('view_logs'));
                        })
                        .catch(() => {
                            this.get('growl').error('Error', 'Error while retrieving logs');
                        });
                } else {
                    this.set('canViewLog', this.model.permission.get('view_logs'));
                }
                if (!this.model.permission.get('manage_users')) {
                    this.transitionToRoute('folders');
                }
            }
        }
    }
});
