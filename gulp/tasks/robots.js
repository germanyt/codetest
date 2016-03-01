/**
 * @author Gavin
 * @description 添加robots.txt
 * @todo 看下sourcemap的bug  https://github.com/plus3network/gulp-less/pull/164
 */

'use strict';

var gulp = require('gulp');

var handleErrors = require('../util/handleErrors');
var config = require('../config');
var rename = require('gulp-rename');

var runSequence = require('run-sequence');

// var argv = require('yargs').argv;
var isProduction = config.env == 'production';

// console.log(argv, isDisallow);
gulp.task('robots', function(){
    if(isProduction){
        return gulp.src('app/robots_prod.txt')
        .pipe(rename('robots.txt'))
        .pipe(gulp.dest(config.dest));
    } else {
        return gulp.src('app/robots.txt')
        .pipe(gulp.dest(config.dest));
    }
});
