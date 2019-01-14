import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('password/password-content', 'Integration | Component | password/password content', {
    integration: true
});

skip('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{password/password-content}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#password/password-content}}
      template block text
    {{/password/password-content}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});