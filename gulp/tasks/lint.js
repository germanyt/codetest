/**
 * @author Nemo
 * @description 原来是在rebuild js时，对js代码进行规范验证，效果不是太好 暂时不用了
 * @todo 找一个合适的方案做代码规范验证
 */
'use strict';

var config = require('../config');
var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function () {
    return gulp.src([config.scripts.src, '!app/js/templates.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
