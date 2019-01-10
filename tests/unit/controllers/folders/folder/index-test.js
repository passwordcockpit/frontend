import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:folders/folder/index', 'Unit | Controller | folders/folder/index', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: ['controller:folders', 'service:growl', 'service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
