/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import { moduleFor, test } from 'ember-qunit';

moduleFor('route:index', 'Unit | Route | index', {
    integration: true
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
