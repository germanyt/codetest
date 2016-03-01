/**
 * @author Nemo
 * @description 统一处理一些组合任务，如dev/production/deploy
 */
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
// var argv = require('yargs').argv;

var isProduction = require('../util/nodeEnv')();

/**
 * 开发阶段执行的任务
 *    clean<-beforeAll<-style/images/template(views)<-js<-watch
 * @todo 整理下子任务之间的依赖关系
 */
gulp.task('dev', ['clean'], function (cb) {

    cb = cb || function () {
    };

    global.isProd = false;

    runSequence('beforeAll', ['styles', 'browserify', 'images'], 'views', 'watch', 'connect', cb);

});

/**
 * 生产环境执行的任务
 */
gulp.task('prod', function (cb) {

    cb = cb || function () {
    };

    global.isProd = true;

    runSequence('beforeAll', 'images', 'styles', 'browserify', 'views', 'robots', 'afterAll', /*'gzip', */cb);

});

/**
 * 部署
 */
gulp.task('deploy', ['prod'], function () {

});



gulp.task('default', function(cb){
    if(!isProduction){
        runSequence('dev', cb);
    } else {
        runSequence('prod', cb);
    }
});
