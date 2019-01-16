/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery'

moduleForComponent('folder/folder-users', 'Integration | Component | folder/folder-users', {
    integration: true
});

test('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{folder/folder-users}}`);

    assert.equal(this.$().text().trim(), 'Rights on folder');

    // Template block usage:
    this.render(hbs`
    {{#folder/folder-users}}
      template block text
    {{/folder/folder-users}}
  `);

    assert.equal($.trim(this.$().text().trim().replace(/\s\s+/g, ' ')), 'Rights on folder');
});
