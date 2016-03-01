/**
 * @author Gavin
 * @description 处理bower管理文件
 *              把bower目录中css文件移动到styles目录
 *              把相应css文件改为less，以便在app.less里引入
 * @todo 自动生成icomoom字体文件和样式文件
 */
'use strict';

var config = require('../config');

var gulp = require('gulp');
var rename = require('gulp-rename');

var bowerDir = './app/bower';

var targetDir = config.src+'/styles/vendor';
gulp.task('bowerStyles', function () {
    return gulp.src([
            bowerDir + '/normalize.css/normalize.css'
        ])
        .pipe(rename(function (path) {
            // console.log(path);
            path.extname = ".less";
        }))
        .pipe(gulp.dest(targetDir));

    // return gulp.src(baseDir + '/fonts/**/*')
    //     .pipe(gulp.dest('./build/css/fonts'));
});

// move bootstrap's fonts to dist
// gulp.task('vendorFont', function () {
//     return gulp.src('./app/bower/bootstrap/dist/fonts/*')
//         .pipe(gulp.dest('./build/fonts'));
// })
