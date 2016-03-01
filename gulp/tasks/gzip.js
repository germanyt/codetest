/**
 * @author Nemo
 * @description 暂时不用，在ngix层控制gzip即可
 *              不过提前做好gzip压缩，也不无道理
 * @todo 区分开发环境和生产环境引入的文件不同，尝试生产环境直接引入gzip压缩后的文件
 */
'use strict';

var gulp = require('gulp');
var gzip = require('gulp-gzip');
var config = require('../config');

gulp.task('gzip', function () {

    return gulp.src(config.gzip.src)
        .pipe(gzip(config.gzip.options))
        .pipe(gulp.dest(config.gzip.dest));

});
