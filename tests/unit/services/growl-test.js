/** 
* @see https://github.com/password-cockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/password-cockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { module, skip, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | growl', function (hooks) {
    setupTest(hooks);

    let normalError = {
        "errors": [
            {
                "name": "username",
                "value": "",
                "messages": [
                    "Value is required and can't be empty",
                    "The input is less than 2 characters long"
                ]
            },
            {
                "name": "name",
                "value": "",
                "messages": [
                    "Value is required and can't be empty",
                    "The input is less than 1 characters long"
                ]
            },
            {
                "name": "surname",
                "value": "",
                "messages": [
                    "Value is required and can't be empty",
                    "The input is less than 3 characters long"
                ]
            }
        ],
        "title": "Bad Request",
        "type": "https://httpstatuses.com/400",
        "status": 400,
        "detail": "Validation error"
    };
    let normalErrorWithoutErrors = {
        "title": "Bad Request",
        "type": "https://httpstatuses.com/400",
        "status": 400,
        "detail": "Validation error"
    };
    let responseJSONError =
    {
        "responseJSON": {
            "errors": [
                {
                    "name": "name",
                    "value": "",
                    "messages": [
                        "Value is required and can't be empty",
                        "The input is less than 2 characters long"
                    ]
                }
            ],
            "title": "Bad Request",
            "type": "https://httpstatuses.com/400",
            "status": 400,
            "detail": "Validation error"
        }
    };
    let responseJSONErrorWithoutErrors =
    {
        "responseJSON": {
            "title": "Bad Request",
            "type": "https://httpstatuses.com/400",
            "status": 400,
            "detail": "Validation error"
        }
    };
    skip('skip -  notice() test', function (assert) {
        assert.ok(true)
    });

    skip('skip -  error() test', function (assert) {
        assert.ok(true)
    });

    skip('skip -  errorShowRaw() test', function (assert) {
        assert.ok(true)
    });

    skip('skip -  errorsDatabase() test', function (assert) {
        assert.ok(true)
    });

    test('errorsDatabaseToArray() - normal DB error - test', function (assert) {
        const growl = this.owner.lookup('service:growl');

        let result=growl.errorsDatabaseToArray(normalError);
        assert.notEqual(result.name, undefined);
        assert.equal(result.name[0], "Value is required and can't be empty");
        assert.equal(result.name[1], "The input is less than 1 characters long");
        assert.notEqual(result.username, undefined);
        assert.equal(result.username[0], "Value is required and can't be empty");
        assert.equal(result.username[1], "The input is less than 2 characters long");
        assert.notEqual(result.surname, undefined);
        assert.equal(result.surname[0], "Value is required and can't be empty");
        assert.equal(result.surname[1], "The input is less than 3 characters long");
    });
    test('errorsDatabaseToArray() - normal DB error without error - test', function (assert) {
        const growl = this.owner.lookup('service:growl');

        let result=growl.errorsDatabaseToArray(normalErrorWithoutErrors);
        assert.equal(result.name, undefined);
        assert.equal(Object.keys(result).length, 0);
    });

    test('errorsDatabaseToArray() - JSON error - test', function (assert) {
        const growl = this.owner.lookup('service:growl');

        let result=growl.errorsDatabaseToArray(responseJSONError);
        assert.notEqual(result.name, undefined);
        assert.equal(result.name[0], "Value is required and can't be empty");
        assert.equal(result.name[1], "The input is less than 2 characters long");
    });
    test('errorsDatabaseToArray() - JSON error without error - test', function (assert) {
        const growl = this.owner.lookup('service:growl');

        let result=growl.errorsDatabaseToArray(responseJSONErrorWithoutErrors);
        assert.equal(result.name, undefined);
        assert.equal(Object.keys(result).length, 0);
    });
});