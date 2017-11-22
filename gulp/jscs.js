/*eslint-env node*/
var $    = require('gulp-load-plugins')();
var gulp = require('gulp');

var options = global.gulpOptions,
    DIST = options.DIST,
    SRC = options.SRC;

gulp.task('jscs', function() {
  return gulp.src([SRC + '/assets-cp/js/**/*.js',
        SRC + '/assets-cp/js/*.js'])
    .pipe($.jscs())
    .pipe($.jscsStylish());
});
