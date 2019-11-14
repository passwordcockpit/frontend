/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

'use strict';

module.exports = {
    passwordFormConfig: {
        icons: ['key', 'user', 'user-secret', 'user-graduate', 'users', 'music', 'search', 'envelope',
            'heart', 'star', 'film', 'th-large',
            'th', 'th-list', 'check', 'times', 'power-off',
            'signal', 'cog', 'home', 'file', 'clock', 'cloud', 
            'road', 'arrow-circle-down', 'arrow-circle-up', 'inbox', 
            'play-circle', 'list-alt', 'lock', 'flag', 'headphones', 
            'volume-up', 'qrcode', 'barcode', 'tag', 'book', 
            'bookmark', 'print', 'camera', 'wifi', 'address-book', 'anchor',  
            'asterisk', 'ban', 'bed','bell','bolt','bomb',
            'bone','bong','briefcase-medical', 'briefcase', 'bug','building', 'bus', 'calculator', 'calendar',
            'campground','candy-cane', 'capsules', 'car', 'certificate', 'coins', 'credit-card', 'desktop',
            'download', 'exclamation', 'fingerprint', 'fish', 'flask', 'gamepad', 'gift', 'hammer', 'hdd', 'image', 
            'laptop', 'map-marker', 'money-bill', 'mobile-alt', 'paperclip', 'pastafarianism', 
            'poo', 'radiation', 'restroom', 'rss', 'satellite', 'save','sd-card','server', 'share-alt', 'shopping-cart','sim-card', 
            'smile', 'space-shuttle', 'thumbs-up', 'thumbs-down', 'toilet-paper', 'tools', 'tree', 'tshirt'],
        options: {
            content_css: '/tinymce.css',
            menubar: false,
            plugins: 'lists',
            toolbar1: 'bold italic underline | bullist numlist',
            formats: {
                underline: { inline: 'u' },
            }
        },
    }
};
  