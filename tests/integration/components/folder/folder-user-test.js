/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('folder/folder-user', 'Integration | Component | folder/folder user', {
    integration: true
});

test('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{folder/folder-user}}`);

    assert.equal(this.$().text().trim(), '');

    // Render component passing unuses varaible
    this.render(hbs`
    {{#folder/folder-user}}
        template block text
    {{/folder/folder-user}}
  `);

    assert.equal(this.$().text().trim(), '');
});
