/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
    this.route('users', function () {
        this.route('user', { path: ':user_id' });
        this.route('new-user');
    });
    this.route('folders', function () {
        this.route('folder', { path: '/:folder_id' }, function () {
            this.route('new-password');
            this.route('passwords', function () {
                this.route('password', { path: '/:password_id' });
            });
        });
    });
    this.route('login');
    this.route('profile');
    
    this.route('sorry-page');
    this.route('bad-url', { path: '/*bad-url' });
});

export default Router;
