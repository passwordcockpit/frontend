/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Component from '@ember/component';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);

Component.reopen({
    attributeBindings: ['data-validation', 'data-validation-length']
});