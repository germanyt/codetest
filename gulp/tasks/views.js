'use strict';

var config = require('../config');
var gulp = require('gulp');
// var templateCache = require('gulp-angular-templatecache');

var fileinclude = require('gulp-file-include');
var htmlmin = require('gulp-htmlmin');

var revReplace = require('gulp-rev-replace');

var runSequence = require('run-sequence');

// var argv = require('yargs').argv;
// var isProduction = !!(argv.env !== 'dev') || global.isProd;

var isProduction = require('../util/nodeEnv')();

var fileOptions = {
    context: {
        env: config.env
    }
};

// console.log(argv, isProduction, global.isProd);

// Views task
// gulp.task('buildViews', function () {
// // console.log(fileOptions);
//     // Put our index.html in the dist folder

//     return gulp.src(config.views.src)
//         .pipe(fileinclude( fileOptions ))
//         .pipe(htmlmin({
//             collapseWhitespace: true,
//             removeComments: true
//         }))
//         .pipe(gulp.dest(config.views.revDest));

// });


gulp.task('views:deploy', function(){
    return gulp.src(config.views.src)
        .pipe(fileinclude( fileOptions ))
        .pipe(revReplace({
            manifest: gulp.src(config.rev.fileName)
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(config.views.dest));
});

gulp.task('views:develop', function () {
// console.log(fileOptions);
    // Put our index.html in the dist folder


    gulp.src(config.src + '/data/*.json').pipe(gulp.dest(config.dest));

    return gulp.src(config.views.src)
        .pipe(fileinclude( fileOptions ))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(config.views.dest));

});


gulp.task('views', function(cb){
    if(isProduction){
        runSequence('views:deploy', cb);
    } else {
        runSequence('views:develop', cb);
    }
});
