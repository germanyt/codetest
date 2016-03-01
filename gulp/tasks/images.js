/**
 * @author Nemo
 * @description 保持目录结构同步拷贝到dist
 *              做些必要的压缩
 * @todo 每次启动时都会对图片压缩以便，当图片量大时势必会影响第一次启动gulp任务的时间
 *       图片优化一次就够了，看后面如何智能解决这一点
 */

'use strict';

var config = require('../config');

var fs = require('fs');

var changed = require('gulp-changed');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');

var runSequence = require('run-sequence');

var rev = require('gulp-rev');

// var argv = require('yargs').argv;
// var isProduction = !!(argv.env !== 'dev') || global.isProd;

var isProduction = require('../util/nodeEnv')();


gulp.task('images:deploy', function(){
    return gulp.src(config.images.src)
        .pipe(rev())
        .pipe(gulp.dest(config.images.dest))
        .pipe(rev.manifest(config.rev.fileName, {
            base: config.rev.dest,
            merge: true
        }))                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest(config.rev.dest));
});

// gulp.task('imagesMinify:deploy', function(){
//     return gulp.src(config.images.revSrc)
//         .pipe(changed(config.images.dest, {hasChanged: function(stream, cb, sourceFile, destPath){
//             // console.log(arguments);

//             var fileName = sourceFile.path;

//             fs.exists(destPath, function( exists ){
//                 if(!exists) {
//                     stream.push(sourceFile);
//                 }
//                 cb();
//             });

//             // console.log(fileName);
//         }})) // Ignore unchanged files
//         // .pipe(gulpif(global.isProd, imagemin())) // Optimize
//         .pipe(gulp.dest(config.images.dest));
// });


gulp.task('images:develop', function(){
    return gulp.src(config.images.src)
        .pipe(changed(config.images.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.images.dest));
});

gulp.task('images', function (cb) {

    if(isProduction){
        runSequence( 'images:deploy' , cb);
    } else {

        runSequence( 'images:develop' , cb);
    }

});

