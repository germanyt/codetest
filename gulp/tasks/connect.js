/**
 * @author Nemo
 */

'use strict';

var config = require('../config');
var gulp = require('gulp');
var connect = require('gulp-connect');


gulp.task('connect', function () {

    connect.server({
        root : (config.env == 'dev') ? config.dest: config.dest_final,
        port : config.connectPort
    });

});
