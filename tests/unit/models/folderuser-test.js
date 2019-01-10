import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from "@ember/runloop";
module('Unit | Model | folderuser', function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        let controller = this.owner;
        assert.ok(controller);
    });
    test('setAccess true', function (assert) {
        const folderUser = run(() => this.owner.lookup('service:store')
        .createRecord('folderuser', { 
            username: 'Pippo Pluto',
            name: 'Pluto',
            surname: 'Pippo',
            access: null,
            enabled: true
        }));
        assert.equal(folderUser.get('username'), 'Pippo Pluto');
        assert.equal(folderUser.get('access'), null);

        run(() => folderUser.setAccess(true));

        assert.equal(folderUser.get('access'), 2);
    });
    test('setAccess false', function (assert) {
        const folderUser = run(() => this.owner.lookup('service:store')
        .createRecord('folderuser', { 
            username: 'Pippo Pluto',
            name: 'Pluto',
            surname: 'Pippo',
            access: null,
            enabled: true
        }));
        assert.equal(folderUser.get('username'), 'Pippo Pluto');
        assert.equal(folderUser.get('access'), null);

        run(() => folderUser.setAccess(false));

        assert.equal(folderUser.get('access'), 1);
    });
});