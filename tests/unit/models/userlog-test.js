/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { moduleForModel, test } from 'ember-qunit';

moduleForModel('userlog', 'Unit | Model | userlog', {
    integration: true
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(model);
});
