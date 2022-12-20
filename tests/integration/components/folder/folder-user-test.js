import { module, test } from 'qunit';
/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | folder/folder user', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await render(hbs`{{folder/folder-user}}`);

      assert.dom(this.element).hasText('');

      // Render component passing unuses varaible
      await render(hbs`
      {{#folder/folder-user}}
          template block text
      {{/folder/folder-user}}
    `);

      assert.dom(this.element).hasText('');
  });
});
