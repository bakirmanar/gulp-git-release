var $               = require('gulp-load-plugins')();
var gulp            = require('gulp');

var options = global.gulpOptions,
    DIST = options.DIST;

gulp.task('gzip', function() {
    return gulp.src([DIST + '/**/*.js',
            DIST + '/**/*.css',
            DIST + '/**/*.html',
            DIST + '/robots.txt',
            DIST + '/sitemap.xml'], { base: DIST + '/' })
        .pipe($.plumber())
        .pipe($.gzip())
        .pipe(gulp.dest(DIST));
});
