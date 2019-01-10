import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user/user-rights', 'Integration | Component | user/user rights', {
    integration: true
});

skip('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{user/user-rights}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#user/user-rights}}
      template block text
    {{/user/user-rights}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});
