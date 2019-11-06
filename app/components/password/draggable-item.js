import Component from '@ember/component';

export default Component.extend({
  classNames        : [ 'draggable-item' ],
  attributeBindings : [ 'draggable' ],
  draggable         : 'true',
  
  dragStart(event) {
    // var img = new Image(); 
    // img.src = '../../../assets/images/gearwheel_black.png';
    // event.dataTransfer.setDragImage(img, 0, 0);
    let pwId = this.get('content');
    let fldId = this.get('folder');
    let data = {
        "passwordId":pwId, 
        "folderId":fldId
    };
    return event.dataTransfer.setData('text/data', JSON.stringify(data));
  }
});