/*eslint-env node*/

// -------------------------------------
// This file processes all of the assets in the "src" folder, combines them with the Libraries for Apps assets, and outputs the finished files in the "dist" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -
//

/*
 * gulpfile.js
 * ===========
 * Rather than manage one giant configuration file responsible
 * for creating multiple tasks, each task has been broken out into
 * its own file in the 'gulp' folder. Any files in that directory get
 *  automatically required below.
 *
 * To add a new task, simply add a new task file in that directory.
 */

var gulp = require('gulp');
var argv = require('yargs').argv;
var requireDir = require('require-dir');

global.gulpOptions = {
    host: "http://localhost",
    port: "8764",

    proxy_allow_self_signed_cert: false,

    // Serve View via https.
    // use_https: true,
    // https: {
    //   key: 'path/to/your/server.key',
    //   cert: 'path/to/your/server.crt'
    // },

    GIT_REPO_URL: 'bakirmanar/gulp-git-release',
    GIT_USER: 'bakirmanar',
    NEW_TAG: 'v0.0.2',
    LAST_TAG: 'v0.0.1',
    ZIP_NAME: "build",
    TARGET: "master",
    IS_DRAFT: true,
    IS_PRERELEASE: true,

    SRC: './src',
    DIST: './dist',
    LIBS_JS: [
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/angular/angular.js',
        './node_modules/angular-animate/angular-animate.min.js',
        './node_modules/angular-aria/angular-aria.min.js',
        './node_modules/angular-material/angular-material.min.js',
        './node_modules/@uirouter/angularjs/release/angular-ui-router.js',
        './node_modules/angular-sanitize/angular-sanitize.min.js',
        './node_modules/angular-wizard/dist/angular-wizard.min.js',
        './node_modules/angular-material-data-table/dist/md-data-table.min.js',
        './node_modules/angular-material-expansion-panel/dist/md-expansion-panel.min.js',
        './node_modules/lodash/lodash.min.js',
        './node_modules/clipboard/dist/clipboard.js',
        './node_modules/ngclipboard/dist/ngclipboard.js',
        './node_modules/angular-translate/dist/angular-translate.min.js',
        './node_modules/angular-messages/angular-messages.min.js',
        './node_modules/intro.js/intro.js',
        './node_modules/angular-intro.js/build/angular-intro.min.js',
        './node_modules/ammap3/ammap/ammap.js',
        './node_modules/ammap3/ammap/maps/js/worldLow.js',
        './node_modules/moment/min/moment.min.js',
        './src/assets-cp/libs/tldjs.js',
    ],
    LIBS_CSS: [
        './node_modules/angular-material/angular-material.min.css',
        './node_modules/angular-material-icons/angular-material-icons.css',
        './node_modules/angular-wizard/dist/angular-wizard.min.css',
        './node_modules/angular-material-data-table/dist/md-data-table.min.css',
        './node_modules/angular-material-expansion-panel/dist/md-expansion-panel.min.css',
        './node_modules/intro.js/introjs.css',
    ],
    MODULES: [
    ],
};

// Check for flags
global.isProduction = !!(argv.production);
global.isJscsOff = !!(argv.offJscs);

// 3. TASKS
// - - - - - - - - - - - - - - -

// Require all tasks in the 'gulp' folder.
requireDir('./gulp', { recurse: false });


// Default task
//
// builds your app, starts a server, and recompiles assets when they change.

gulp.task('default', ['serve']);
