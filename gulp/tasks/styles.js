/**
 * @author Nemo
 * @description 编译less文件
 * @todo 看下sourcemap的bug  https://github.com/plus3network/gulp-less/pull/164
 */

'use strict';

var fs = require('fs');

var gulp = require('gulp');
var less = require('gulp-less');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config = require('../config');
var configLess = config.less;
var autoprefixer = require('gulp-autoprefixer');
var gulpif = require('gulp-if');

var runSequence = require('run-sequence');

var minifyCSS = require('gulp-cssnano');
var size = require('gulp-filesize');

var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

// var argv = require('yargs').argv;
// var isProduction = !!(argv.env !== 'dev') || global.isProd;

var isProduction = require('../util/nodeEnv')();

// console.log(argv, isProduction);

//CSS里更新引入文件版本号
// gulp.task('revCollectorCss', function () {
//   return gulp.src([config.rev.dest + '/**/*.json', config.revSrcAll])
//     .pipe(revCollector())
//     .pipe(rev())
//     // .pipe(changed(config.dest, {hasChanged: function(stream, cb, sourceFile, destPath){
//     //         // console.log(arguments);

//     //         var fileName = sourceFile.path;

//     //         fs.exists(destPath, function( exists ){
//     //             if(!exists) {
//     //                 stream.push(sourceFile);
//     //             }
//     //             cb();
//     //         });

//     //         // console.log(fileName);
//     //     }}))
//     .pipe(gulp.dest(config.dest))
//     .pipe(rev.manifest('rev-styles.json', {
//         merge: true
//     }))                                   //- 生成一个rev-manifest.json
//     .pipe(gulp.dest(config.rev.dest));
// });
//生产：合并styles
gulp.task('compileStyles:deploy', ['bowerStyles', 'iconFont'], function () {
    return gulp.src(configLess.srcToBeCompile)
        .pipe(less(configLess.settings))
        .on('error', handleErrors)

        .pipe(revReplace({
            manifest: gulp.src(config.rev.fileName)
        }))

        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1']
        }))
        .pipe( minifyCSS({
            keepBreaks: false,
            compatibility: 'ie8',
            zindex: false
        }))
        .pipe(size())

        .pipe(rev())

        .pipe(gulp.dest(configLess.dest))
        .pipe(rev.manifest(config.rev.fileName, {
            base: config.rev.dest,
            merge: true
        }))                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(config.rev.dest));
});

//开发：合并styles
gulp.task('compileStyles:develop', ['bowerStyles', 'iconFont'], function () {
    return gulp.src(configLess.srcToBeCompile)
        .pipe(less(configLess.settings))
        .on('error', handleErrors)
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1']
        }))
        .pipe(size())
        .pipe(gulp.dest(configLess.dest));
});

gulp.task('styles', function(cb){
    // console.log(config.isProduction);
    if(isProduction){
        runSequence('compileStyles:deploy', cb);
    } else {
        runSequence('compileStyles:develop', cb);
    }
});




