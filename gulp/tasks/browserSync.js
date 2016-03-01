/**
 * @author Nemo
 * @description 监听文件变化，自动刷新浏览器
 *              暂时去掉了这个任务
 * @todo 既然现在前后端彻底做了工程上的分离，那么前端就可以再利用好这个sync task
 *       后端接口在开发阶段放开跨域限制
 */

'use strict';

var config = require('../config');
var browserSync = require('browser-sync');
var gulp = require('gulp');

gulp.task('browserSync', function () {

    browserSync({
        port: config.browserPort,
        ui: {
            port: config.UIPort
        },
        proxy: 'localhost:' + config.serverPort
    });

});
