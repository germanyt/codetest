/**
 * @author Gavin
 * @description 所有任务执行之后，对生产环境进行打包
 *
 */
'use strict';

var config = require('../config');
// var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
// var del = require('rimraf');


var renameDir = require('gulp-rename-dir');

// var bakBuild = function(cb){
//     fs.rename(config.dest_final, config.dest_bak, function(err){
//         if(err){
//             gutil.log('原部署目录重命名失败');
//             cb();
//         } else {
//             creatBuild(cb);
//         }
//     });
// };

// var creatBuild = function(cb){
//     fs.rename(config.dest, config.dest_final, function(err){
//         if(err){
//             gutil.log('新部署目录重命名失败，网站已经无法访问，请尽快解决');
//             cb();
//         } else {
//             gutil.log('部署完成');
//             del(config.dest_bak, cb);
//         }
//     });
// };

gulp.task('afterAll', function(cb){
    // console.log(config.dest_final, config.dest_bak);

    // fs.exists(config.dest_final, function(exists){
    //     if(exists){
    //         bakBuild(cb);
    //     } else {
    //         creatBuild(cb);
    //     }
    // })

    renameDir({
        tmpPath: config.dest,
        destPath: config.dest_final,
        bakPath: config.dest_bak
    }, function(){
        gutil.log('部署完成');
        cb();
    });
});
