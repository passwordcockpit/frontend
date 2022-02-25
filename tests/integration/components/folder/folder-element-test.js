import { click } from '@ember/test-helpers';
/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | folder/folder element', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        const store = this.owner.lookup('service:store');
        let testFolder = run(() => {
            return store.createRecord('folder', {
                name: 'Pippo',
                access: 1
            });
        });
        this.set('folder', testFolder)

        this.set('functionCalled', false)
        this.set('onClick', () => {
            this.set('functionCalled', true)
        });
    });
    test('it renders', function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.on('myAction', function(val) { ... });

        this.render(hbs`{{folder/folder-element}}`);

        assert.dom(this.element).hasText('');

        // Render component passing unuses varaible
        this.render(hbs`
          {{#folder/folder-element}}
              template block text
          {{/folder/folder-element}}
      `);

        assert.dom(this.element).hasText('');
    });
    skip('onCreateFolder', async function(assert) {
        //check init variable
        assert.notOk(this.functionCalled);
        assert.equal(this.folder.get('isAdd'), false);

        this.folder.set('isAdd', true);
        //let component = this.owner.lookup('component:folder-element');
        this.set('onClick', (actual) => {
            let expected = { comment: 'You are not a wizard!' };
            assert.deepEqual(actual, expected, 'submitted value is passed to external action');
        });

        this.render(hbs`{{folder/new-folder-element parentId=1 onCreateFolder=(action onClick)}}`);

        await click('.action-save');
        //assert.ok(this.get('functionCalled'));
        assert.equal(this.folder.get('isAdd'), false);
    });
});