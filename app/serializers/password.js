/**
 * @see https://github.com/passwordcockpit/frontend for the canonical source repository
 * @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch)
 * @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License
 */

import HalSerializer from 'ember-data-hal-9000/serializer';

export default HalSerializer.extend({
  primaryKey: 'password_id',
  serialize(snapshot) {
    let attributes = {};
    Object.keys(snapshot._attributes).forEach((key) => {
      attributes[this.keyForAttribute(key)] = snapshot._attributes[key];
    });

    return attributes;
  },
});
