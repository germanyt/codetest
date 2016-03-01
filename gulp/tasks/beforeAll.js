/**
 * @author Nemo
 * @description 所有任务执行之前必须先执行的任务
 *              也有些临时方案，比如angular-ui-switch这个模块的bug处理（详见下面）
 */
'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');

/**
 * angular-ui-switch这个模块坑爹
 * package.json里配置的main字段是ui-switch.js
 * 但是实际上文件名是angular-ui-switch.js
 * 造成引入模块时报错
 * 这里就是自动改个名字
 */
var uiSwitchBaseDir = './node_modules/angular-ui-switch';
gulp.task('tobedel:renameNgUISwitchJS', function () {
    return gulp.src(uiSwitchBaseDir + '/angular-ui-switch.js')
        .pipe(rename('ui-switch.js'))
        .pipe(gulp.dest(uiSwitchBaseDir))
});

gulp.task('beforeAll', ['tobedel:renameNgUISwitchJS']);
