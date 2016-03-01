/**
 * @author Nemo
 * @description 处理icomoon
 *              把生成的icomoon目录下webfonts文件移动到dist目录
 *              把相应css文件改为less，以便在app.less里引入
 * @todo 自动生成icomoom字体文件和样式文件
 */
'use strict';

var config = require('../config');
var gulp = require('gulp');
var rename = require('gulp-rename');

var baseDir = config.icomoon.src;
gulp.task('iconFont', function () {
    gulp.src(baseDir + '/style.css')
        .pipe(rename(function (path) {
            // console.log(path);
            path.extname = ".less";
        }))
        .pipe(gulp.dest(baseDir));

    return gulp.src(baseDir + '/fonts/**/*')
        .pipe(gulp.dest(config.icomoon.dest));
});

// move bootstrap's fonts to dist
// gulp.task('vendorFont', function () {
//     return gulp.src('./app/bower/bootstrap/dist/fonts/*')
//         .pipe(gulp.dest('./build/fonts'));
// })

