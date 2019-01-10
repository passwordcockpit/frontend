import { moduleFor, test } from 'ember-qunit';

moduleFor('route:folders', 'Unit | Route | folders', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: ['service:session', 'service:account', 'service:growl', 'service:close-folders-inputs']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
