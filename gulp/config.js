'use strict';
var path = require('path');

// var argv = require('yargs').argv;

var isProduction = require('./util/nodeEnv')();

var dest = path.resolve(__dirname, "./../build_temp");
var dest_bak = path.resolve(__dirname, "./../build_bak");
var dest_final = path.resolve(__dirname, "./../build");
var src = path.resolve(__dirname, './../app');


if(!isProduction){
    dest = dest_final;
}

var rev = dest + '/rev';

module.exports = {
    src: src,
    dest: dest,

    dest_final: dest_final,

    dest_bak: dest_bak,

    'dist': { //要与dest字段合并
        'root': dest
    },

    env: process.env.NODE_ENV || 'dev',

    'browserPort': 3000,
    'UIPort': 3001,
    'serverPort': 3002,
    'connectPort': 1024,

    icomoon: {
        src: src+'/styles/app/icons/icomoon',
        dest: dest + '/css/fonts'
    },

    less: {
        srcAll: src + "/styles/**/*.less",
        srcToBeCompile: src + "/styles/*.less",
        dest: dest + '/css',
        revStyles: rev + '/styles',
        revSrcAll: rev + '/styles/**/*.css',
        settings: {}
    },

    'styles': {
        'src': 'app/styles/**/*.scss',
        'dest': dest + '/css'
    },

    'scripts': {
        'src': 'app/js/**/*.js',
        'dest': dest+'/js',
        'pageSrc': src + '/js/+(pages)/**/*.js'
    },

    'images': {
        'src': 'app/images/**/*.{png,jpg,jpeg,gif,svg,ico}',
        'dest': dest+'/images',
        'revDest': rev + '/images/',
        'revSrc': rev + '/images/**/*',
    },

    'fonts': {
        'src': ['app/fonts/**/*'],
        'dest': dest+'/fonts'
    },

    'rev': {
        'dest': rev,
        'fileName': rev + '/manifest.json',
        'root': rev
    },

    'views': {
        'watch': [
            'app/views/**/*.html',
            'app/pages/*.html',
            'app/tpls/**/*.html'
        ],
        'src': 'app/views/**/*.html',
        'dest': dest,
        'revDest': rev + '/views',
        'revSrc': rev + '/views/**/*.html'
    },

    'gzip': {
        'src': dest+'/**/*.{html,xml,json,css,js,js.map}',
        'dest': dest+'/',
        'options': {}
    },

    'browserify': {
        'entries': ['./app/js/index.js'],
        'bundleName': 'index.js',
        'sourcemap': true
    },

    'test': {
        'karma': 'test/karma.conf.js',
        'protractor': 'test/protractor.conf.js'
    }

};
