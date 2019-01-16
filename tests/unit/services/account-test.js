/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | account', function (hooks) {
    setupTest(hooks);

    let user = {
        "id": 1,
        "user_id": 1,
        "username": "pippo",
        "password": "pippo",
        "name": "Pippo",
        "surname": "Caio 1",
        "phone": null,
        "email": null,
        "status": true,
        "_links": {
            "self": {
                "href": "http://10.0.3.120:4343/public/api/v1/users/4"
            }
        }
    };
    test('Init user test', function (assert) {
        const account = this.owner.lookup('service:account');
        assert.equal(account.get('user'), null);
    });
    test('Setter user test', function (assert) {
        const account = this.owner.lookup('service:account');
        account.setUser(user);
        assert.equal(account.get('user').username, 'pippo');
    });
    test('Getter user id test', function (assert) {
        const account = this.owner.lookup('service:account');
        user.id=3;
        account.setUser(user);
        assert.equal(account.getUserId(), 3);
    });
});