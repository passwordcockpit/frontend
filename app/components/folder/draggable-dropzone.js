/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';

export default Component.extend({
    classNames: ['draggable-dropzone'],
    classNameBindings: ['dragClass'],
    dragClass: 'deactivated',

    dragLeave(event) {
        event.preventDefault();
        this.set('dragClass', 'deactivated');
    },

    dragOver(event) {
        event.preventDefault();
        this.set('dragClass', 'activated');
    },

    drop(event) {
        // var data = event.dataTransfer.getData('text/data');
        // this.sendAction('dropped', event);
        this.dropped(event)

        this.set('dragClass', 'deactivated');
    }
});