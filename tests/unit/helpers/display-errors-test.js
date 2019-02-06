/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { displayErrors } from 'passwordcockpit_frontend/helpers/display-errors';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Helper | display errors', function (hooks) {
    setupTest(hooks);

    let normalError = {
        "errors": [
            {
                "name": "username",
                "value": "",
                "messages": [
                    "ab"
                ]
            }
        ]
    };
    test('displayErrors', function (assert) {
        const growl = this.owner.lookup('service:growl');
        let result=growl.errorsDatabaseToArray(normalError);
        assert.equal(displayErrors(result.username), '<div class="errors-list"><p>a</p><p>b</p></div>');
    });
});