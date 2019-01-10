import { displayErrors } from 'password/helpers/display-errors';
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