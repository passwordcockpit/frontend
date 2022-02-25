import { module, skip } from 'qunit';
/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { setupRenderingTest } from 'ember-qunit';
import '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | password/password content', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.render(hbs`{{password/password-content}}`);

      assert.dom(this.element).hasText('');

      // Template block usage:
      this.render(hbs`
      {{#password/password-content}}
        template block text
      {{/password/password-content}}
    `);

      assert.dom(this.element).hasText('template block text');
  });
});
