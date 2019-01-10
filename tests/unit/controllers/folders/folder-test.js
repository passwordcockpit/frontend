import { module, test, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | folders/folder', function (hooks) {
    setupTest(hooks);
    hooks.beforeEach(function () {
        const store = this.owner.lookup('service:store');
        this.set('store', store);
        store.createRecord('folder', {
            id: 1,
            folder_id: 1,
            name: 'Pippo',
            access: 1
        });
        store.createRecord('folder', {
            id: 5,
            folder_id: 5,
            name: 'Pluto',
            access: 1
        });

        this.set('functionCalled', false)
        this.set('onClick', () => {
            this.set('functionCalled', true)
        });
    });

    test('it exists', function (assert) {
        let controller = this.owner;
        assert.ok(controller);
    });

    skip('onSelectFolder', function (assert) {
        let controller = this.owner.lookup('controller:folders.folder');
        assert.equal(controller.get('folderId'), 5);
    });

});