/** 
* @see https://github.com/passwordcockpit/frontend for the canonical source repository 
* @copyright Copyright (c) 2018 Blackpoints AG (https://www.blackpoints.ch) 
* @license https://github.com/passwordcockpit/frontend/blob/master/LICENSE.md BSD 3-Clause License 
*/

'use strict';

module.exports = {
    passwordFormConfig: {
        icons: ['key', 'user', 'music', 'search', 'envelope',
            'heart', 'star', 'star', 'film', 'th-large',
            'th', 'th-list', 'check', 'times', 'power-off',
            'signal', 'cog', 'home', 'file', 'clock'
            , 'road', 'download', 'arrow-circle-down', 'arrow-circle-up', 'inbox'
            , 'play-circle', 'list-alt', 'lock', 'flag', 'headphones'
            , 'volume-up', 'qrcode', 'barcode', 'tag', 'book'
            , 'bookmark', 'print', 'camera'],
        options: {
            menubar: false,
            toolbar1: 'bold italic underline | bullist numlist',
            formats: {
                underline: { inline: 'u' },
            }
        },
    }
};
  