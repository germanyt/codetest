/**
 * @author Nemo
 */

'use strict';

var config = require('../config');
var gulp = require('gulp');
var del = require('rimraf');

// var argv = require('yargs').argv;
// var isProduction = argv.env == 'production';

var isProduction = require('../util/nodeEnv')();

gulp.task('clean', function (cb) {

    if(false){
        del(config.rev.root, cb);
    } else {
        del(config.dist.root, cb);
    }

});


gulp.task('cleanRev', function(cb){
    del(config.rev.root, cb);
});
