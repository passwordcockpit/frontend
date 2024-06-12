'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');

module.exports = function (defaults) {
    let app = new EmberApp(defaults, {
        SRI: {
            enabled: false,
        },
        fingerprint: {
            exclude: [
                'assets/tinymce/**/*.*'
            ]
        },
        'ember-simple-auth': {
            useSessionSetupMethod: true,
        },
        '@embroider/macros': {
            setConfig: {
              '@ember-data/store': {
                polyfillUUID: true
              },
            },
        },
    });

    // Import Bootstrap JS
    app.import('node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js');

    // Import FontAwesome icons
    /*
    app.import('node_modules/font-awesome/fonts/fontawesome-webfont.eot',{ destDir: 'fonts' }); 
    app.import('node_modules/font-awesome/fonts/fontawesome-webfont.svg',{ destDir: 'fonts' }); 
    app.import('node_modules/font-awesome/fonts/fontawesome-webfont.ttf',{ destDir: 'fonts' }); 
    app.import('node_modules/font-awesome/fonts/fontawesome-webfont.woff',{ destDir: 'fonts' }); 
    app.import('node_modules/font-awesome/fonts/fontawesome-webfont.woff2',{ destDir: 'fonts' });
    */
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.eot', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.svg', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2', { destDir: 'fonts' });

    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.eot', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.svg', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2', { destDir: 'fonts' });

    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.eot', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.svg', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff', { destDir: 'fonts' });
    app.import('node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2', { destDir: 'fonts' });


    // Import jQuery growl notifications
    app.import('node_modules/jquery.growl/javascripts/jquery.growl.js');

    // Import Fetch
    //app.import('node_modules/whatwg-fetch/fetch.js');

    // Import File-saver
    app.import('node_modules/file-saver/src/FileSaver.js');

    // Import password generation
    app.import('vendor/pGenerator.js');

    // Import password encrypt
    app.import('vendor/sjcl.js');

    // Use `app.import` to add additional libraries to the generated
    // output files.
    //
    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    var nodes = [];
    nodes.push(new Funnel('vendor', {
        srcDir: '/',
        include: ['tinymce.css'],
        destDir: '/'
    }));
    nodes.push(app.toTree());
    
    return new MergeTrees(nodes);
};
