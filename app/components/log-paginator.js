/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

import Component from '@ember/component';

export default Component.extend({
    selectedPage: null,
    pages: null,
    pageRange: 4,

    didReceiveAttrs() {
        this._super(...arguments);
        let page = this.get('page');
        let pageCount = this.get('pageCount');
        let pageRange = this.get('pageRange');
        let min = null;
        let max = null;
        if (page > 1) {
            this.set('previousDisabled', false);
        } else {
            this.set('previousDisabled', true);
        }
        if (pageCount - page >= 1) {
            this.set('nextDisabled', false);
        } else {
            this.set('nextDisabled', true);
        }
        if (pageCount <= pageRange) {
            min = 1;
            max = pageCount;
        } else {
            if (page <= Math.ceil(pageRange / 2)) {
                min = 1;
                max = pageRange;
            } else if (pageCount - pageRange < page) {
                min = pageCount - pageRange + 1;
                max = pageCount;
            } else {
                if (pageRange % 2 == 0) {
                    min = page - (pageRange / 2 - 1);
                    max = page + pageRange / 2;
                } else {
                    min = page - (Math.floor(pageRange / 2) - 1);
                    max = page + Math.floor(pageRange / 2);
                }
            }
        }

        let pages = [];
        for (let i = min; i <= max; i++) {
            pages.push(i);
        }
        this.set('pages', pages);
    },

    actions: {
        /**
         * Change log's page
         * 
         * @param {*} page - page number
         */
        changePage(page) {
            this.changePage(page);
        },
        /**
         * Change to next log's page
         * 
         * @param {*} page - current page number
         */
        nextPage(page) {
            page += 1;
            this.changePage(page);
        },
        /**
         * Change to previous log's page
         * 
         * @param {*} page - current page number
         */
        previousPage(page) {
            page -= 1;
            this.changePage(page);
        }
    }
});
