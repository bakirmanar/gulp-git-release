var gulp       = require('gulp');
var request    = require('request');
var fs         = require('fs');
var archiver   = require('archiver');
var archive    = archiver('zip');

var GIT_API = 'https://api.github.com/repos/';
var options = global.gulpOptions;
var GIT_REPO_URL = options.GIT_REPO_URL;
var GIT_USER = options.GIT_USER;
var NEW_TAG = options.NEW_TAG;
var LAST_TAG = options.LAST_TAG;
var DIST = options.DIST;
var releaseName = 'gulp-release-check';

gulp.task('release', ['createRelease', 'zipBuild']);

gulp.task('createRelease', function () {

  // changeConfigVersion ();
  getLastTagSha ();
  //getting latest pre-release commit sha
  function getLastTagSha () {
    request({
      url: GIT_API + GIT_REPO_URL + '/tags',
      method: 'GET',
      headers: {
        'User-Agent': GIT_USER
      }
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var bodyObj = JSON.parse(body);
        bodyObj.map(function (tag) {
          if (tag.name == LAST_TAG) {
            var lastTagSha = tag.commit.sha;
            getLastDate(lastTagSha);
          }
        });
      }
    });
  }
  //getting date of latest pre-release
  function getLastDate (lastTagSha) {
    console.log(lastTagSha);
    request({
      url: GIT_API + GIT_REPO_URL + '/commits/' + lastTagSha,
      method: 'GET',
      headers: {
        'User-Agent': GIT_USER
      }
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var bodyObj = JSON.parse(body);
        var lastTagDate = bodyObj.commit.author.date;
        getDescription (lastTagDate);
      }
    });
  }

  //getting list of issues closed since latest release
  function getDescription (lastTagDate) {
    request({
      url: GIT_API + GIT_REPO_URL + '/issues',
      method: 'GET',
      qs: {
        "state": "closed",
        "since": lastTagDate
      },
      headers: {
        'User-Agent': GIT_USER
      }
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var bodyObj = JSON.parse(body);
        var description = bodyObj.map(function (issue) {
          return '# ' + issue.number + ' ' + issue.title;
        });
        description = description.join(', ')|| "Release commit";
        postRelease (description);
      }
    });
  }

  // creating new release and get upload url for assets
  function postRelease (description) {
    console.log('posting');
    var data = {
      tag_name: NEW_TAG,
      name: releaseName,
      body: description,
      draft: true,
      prerelease: true
    };
    request({
      url: GIT_API + GIT_REPO_URL + '/releases',
      method: 'POST',
      headers: {
        'User-Agent': GIT_USER,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {

        var bodyObj = JSON.parse(body);
        console.log(bodyObj);
        /*var uploadUrl = bodyObj.upload_url.replace('{?name,label}', '');*/

        /*uploadAsset (uploadUrl);*/
      }
    });
  }
  function changeConfigVersion () {
    fs.readFile('FUSION_CONFIG.js', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace("version: '" + LAST_TAG + "'", "version: '" + NEW_TAG + "'");

      fs.writeFile('FUSION_CONFIG.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
});

gulp.task('zipBuild', function () {

  var output = fs.createWriteStream('build_' + NEW_TAG + '.zip');

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);

  archive.directory(DIST, '');

  archive.finalize();

});