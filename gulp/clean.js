/*eslint-env node*/
var gulp    = require('gulp');
var rimraf  = require('rimraf');

var options = global.gulpOptions,
    DIST = options.DIST,
    SRC = options.SRC;

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf(DIST, cb);
});

/*gulp.task('clean:templates', function(cb){
  rimraf('./build/assets-cp/js/templates.js', cb);
});

gulp.task('clean:package', function(cb){
  rimraf('', cb);
});
*/
