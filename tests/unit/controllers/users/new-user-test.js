import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:users/new-user', 'Unit | Controller | users/new-user', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: ['controller:users']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
