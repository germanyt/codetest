'use strict';
var config = require('../config');
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var runSequence = require('run-sequence');

gulp.task('test', ['server'], function () {

    return runSequence('unit', 'protractor');

});

gulp.task('path', function(){
    var pt = path.resolve(process.cwd(), 'build');
    console.log(pt, '\n', config.dest);
});
