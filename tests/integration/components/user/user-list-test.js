import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user/user-list', 'Integration | Component | user/user list', {
    integration: true
});

skip('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{user/user-list}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#user/user-list}}
      template block text
    {{/user/user-list}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});
