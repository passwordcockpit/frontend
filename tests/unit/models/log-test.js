import { moduleForModel, test } from 'ember-qunit';

moduleForModel('log', 'Unit | Model | log', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(model);
});