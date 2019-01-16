/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | folders', function (hooks) {
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
        this.set('functionTocall', () => {
            this.set('functionCalled', true)
        });
    });
    hooks.afterEach(function() {
        this.set('functionCalled', false);
    });

    test('it exists', function (assert) {
        let controller = this.owner;
        assert.ok(controller);
    });

    test('showFoldersList', function (assert) {
        let controller = this.owner.lookup('controller:folders');
        assert.equal(controller.get('showList'), true);
        controller.set('showList', false);
        assert.equal(controller.get('showList'), false);
        controller.send('showFoldersList');
        assert.equal(controller.get('showList'), true);
    });
    test('hideFoldersList', function (assert) {
        let controller = this.owner.lookup('controller:folders');
        assert.equal(controller.get('showList'), true);
        controller.send('hideFoldersList');
        assert.equal(controller.get('showList'), false);
    });
    test('addFolder', function (assert) {
        let controller = this.owner.lookup('controller:folders');
        let closeFoldersInputs= {
            closeAllInputs: this.get('functionTocall') 
        }
        controller.set('closeFoldersInputs', closeFoldersInputs);

        assert.equal(controller.get('isAdd'), false);
        assert.equal(this.get('functionCalled'), false);

        controller.send('addFolder');
        assert.equal(controller.get('isAdd'), true);
        assert.equal(this.get('functionCalled'), true);
    });
    test('cancelAddFolder', function (assert) {
        let controller = this.owner.lookup('controller:folders');
        assert.equal(controller.get('isAdd'), false);
        controller.set('isAdd', true);
        controller.send('cancelAddFolder');
        assert.equal(controller.get('isAdd'), false);
    });
});