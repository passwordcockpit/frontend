import Component from '@ember/component';

export default Component.extend({
  classNames        : [ 'draggableDropzone' ],
  classNameBindings : [ 'dragClass' ],
  dragClass         : 'deactivated',

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
    this.sendAction('dropped', event);
    
    this.set('dragClass', 'deactivated');    
  }
});