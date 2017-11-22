/*eslint-env node*/
var $               = require('gulp-load-plugins')();
var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();

var options = global.gulpOptions,
    DIST = options.DIST,
    SRC = options.SRC;

// Compiles Sass
gulp.task('sass', function () {
  var cssnano = $.if(global.isProduction, $.cssnano());

  return gulp.src(
      [SRC + '/assets-cp/scss/*.scss',
       SRC + '/assets-cp/js/*.scss',
       SRC + '/assets-cp/js/**/*.scss'])
      .pipe($.plumber())
      .pipe($.concat('styles.min.css'))
      .pipe($.sass({
          outputStyle: (global.isProduction ? 'compressed' : 'nested'),
          errLogToConsole: true
      }))
      .pipe($.autoprefixer({
          browsers: ['last 2 versions', 'ie 10']
      }))
      .pipe(cssnano)
      .pipe(browserSync.stream())
      .pipe(gulp.dest(DIST + '/assets-cp/css/'));
});
