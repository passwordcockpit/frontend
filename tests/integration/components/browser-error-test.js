/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('browser-error', 'Integration | Component | browser error', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{browser-error}}`);

  assert.equal(this.$().text().trim(), 'This page requires Java script to display all functions correctly.');

  // Render component passing unuses varaible
  this.render(hbs`
    {{#browser-error}}
      template block text
    {{/browser-error}}
  `);

  assert.equal(this.$().text().trim(), 'This page requires Java script to display all functions correctly.');
});
