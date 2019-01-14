import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:folders/folder/passwords/password', 'Unit | Controller | folders/folder/passwords/password', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: ['controller:folders.folder', 'service:growl']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});