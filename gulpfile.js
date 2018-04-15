/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
// generated on 2016-03-02 using generator-openmrs-owa 0.1.0
'use strict';

var fs = require('fs');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var wiredep = require('wiredep').stream;
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');

var plugins = gulpLoadPlugins();

var THIS_APP_ID = 'SystemAdministration';
var THIS_APP_VERSION = '1.1';

var htmlGlob = ['app/**/*.html'];
var resourcesGlob = ['app/**/*.{png,svg,jpg,gif}', 'app/**/*.{css,less}', 
  'app/**/*.js', 'app/**/*.{ttf,woff}', 'app/manifest.webapp', /* list extra resources here */ ];

var Server = require('karma').Server;

var getConfig = function () {
  var config;

  try {
    // look for config file
    config = require('./config.json');
  } catch (err) {
    // create file with defaults if not found
    config = {
      'LOCAL_OWA_FOLDER': 'C:\\\\Users\\\\user\\\\openmrs\\\\SystemAdministration\\\\owa\\\\'
    };

    fs.writeFile('config.json', JSON.stringify(config), function(err) {
    if(err) {
        return gutil.log(err);
    }
      gutil.log("Default config file created");
    });

  } finally {
    return config;
  }
}

/**
 * Run test once and exit
 */

// gulp.task('test', function (done) {
//   new Server({
//     configFile: __dirname + '/test/karma.conf.js',
//     singleRun: true
//   }, done).start();
// });
// gulp.task('test-debug', function (done) {
// 	  new Server({
// 	    configFile: __dirname + '/test/karma.conf.js',
// 	    singleRun: false
// 	  }, done).start();
// 	});

gulp.task('copy-bower-packages', function() {
  try {
    fs.statSync('bower_components');

    return gulp.src(mainBowerFiles(), {
      base: 'bower_components'
    }).pipe(gulp.dest('dist/lib'));
  } catch (err) {
    // Don't panic
  }
});

gulp.task('html', ['copy-bower-packages'], function() {
  try {
    fs.statSync('bower_components');

    // User wiredep to automagically link bower packages
    return gulp.src(htmlGlob).pipe(wiredep({
      ignorePath: '../bower_components/',
      fileTypes: {
        html: {
          replace: {
            js: '<script src="lib/{{filePath}}"></script>',
            css: '<link rel="stylesheet" href="lib/{{filePath}}" />'
          }
        }
      }
    })).pipe(gulp.dest('dist'));
  } catch (err) {
    return gulp.src(htmlGlob)
      .pipe(gulp.dest('dist'));
  }
});

 


gulp.task('resources', function() {
  return gulp.src(resourcesGlob)
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	  livereload.listen();
	  gulp.watch('app/*', ['deploy-local']);
	  gulp.watch('app/**/*.*', ['deploy-local']);
});


gulp.task('deploy-local', ['build'], function() {
    var config = getConfig();

    return gulp.src(['dist/**/*', '!*.zip'])
          .pipe(gulp.dest(config.LOCAL_OWA_FOLDER + THIS_APP_ID));
});

gulp.task('build', ['resources', 'html'], function() {
  return gulp.src('dist/**/*')
    .pipe(plugins.zip(THIS_APP_ID + '-' + THIS_APP_VERSION + '.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
