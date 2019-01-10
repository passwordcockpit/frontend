import { moduleFor, test } from 'ember-qunit';

moduleFor('route:folders/folder', 'Unit | Route | folders/folder', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: ['service:account', 'service:session', 'service:close-folders-inputs']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
