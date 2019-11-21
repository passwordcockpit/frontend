/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Service from '@ember/service';
import $ from 'jquery';
import { later, cancel } from '@ember/runloop';
export default Service.extend({
    showLoadingDelay: 1000,
    showLoadingAfterDelay: false,
    delayOn: false,
    showLoadingLater: null,
    /**
     * show loading after delay
     * delay set in "showLoadingDelay"
     * 
     * @param {bool} delay 
     */
    showLoading(delay = true) {
        let self = this;
        if(delay){
            this.set('showLoadingAfterDelay', true);
            if(this.get('showLoadingLater')){
                cancel(this.get('showLoadingLater'));
            }
            this.set('showLoadingLater', 
                later(self, function() {
                    if(self.get('showLoadingAfterDelay')){
                        $('#loading').show();
                    }
                }, self.get('showLoadingDelay'))
            )    
        } else {
            $('#loading').show();
        }
    },
    hideLoading() {
        $('#loading').hide();
        this.set('showLoadingAfterDelay', false);
    }
});