/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

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
