import { moduleFor, test } from 'ember-qunit';

moduleFor('route:folders/folder/passwords/password', 'Unit | Route | folders/folder/passwords/password', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: ['service:session', 'service:growl']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
