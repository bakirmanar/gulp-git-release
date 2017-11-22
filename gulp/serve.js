/*eslint-env node*/
var log             = require('connect-logger');
var argv            = require('yargs').argv;
var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var historyFallback = require('connect-history-api-fallback');
var proxyMiddleware = require('http-proxy-middleware');

var options = global.gulpOptions,
    SERVE_DIST = options.SERVE_DIST,
    SRC = options.SRC;

// Static Server + watching build and live reload accross all the browsers
gulp.task('browsersync', ['build'], function() {

  var openPath = getOpenPath();

  var proxyConfig = {
    target: options.host + ':' + options.port
  };

  // Allow self signed proxys to pass through with setting.
  if(options.proxy_allow_self_signed_cert === true) {
    proxyConfig['secure'] = false;
  }

  // build middleware.
  var middleware = [
    log(),
    proxyMiddleware('/api', proxyConfig),
    historyFallback({ index: '/' + openPath + '/index.html' })
  ];

  var browserSyncConfig = {
    baseDir: SERVE_DIST + '/',
    middleware: middleware,
    ghostMode: false
  };

  if(options.use_https === true){
    browserSyncConfig['https'] = true;
    if(options.hasOwnProperty('https') && options.https.hasOwnProperty('key') && options.https.hasOwnProperty('cert')){
      browserSyncConfig['https'] = {
        key: options.https.key,
        cert: options.https.cert
      };
    }
  }

  browserSync.init({
    server: browserSyncConfig
  });
});

//Reloads all the browsers
gulp.task('reloadBrowsers', function(cb){
  browserSync.reload();
  //callback so sequences are aware when this is done
  cb();
});

gulp.task('serve', ['browsersync', 'watch']);

gulp.task('default', ['browsersync', 'watch']);

function getOpenPath() {
  var src = argv.open || '';
  if (!src) {
    return '.';
  }
  return src;
}
