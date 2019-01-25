/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | browser error', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
        const intl = this.owner.lookup('service:intl');
        intl.set('locale', ['en', 'it']);
    });
    test('it renders', async function (assert) {
        await render(hbs`{{browser-error}}`);
        assert.equal(this.$().text().trim(), 'This page requires Java script to display all functions correctly.');

        // Render component passing unuses varaible
        await render(hbs`
        {{#browser-error}}
          template block text
        {{/browser-error}}
      `);

        assert.equal(this.$().text().trim(), 'This page requires Java script to display all functions correctly.');
    });
});