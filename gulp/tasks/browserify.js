/**
 * @author Nemo
 * @description Rewrite based on Jake Marsh <jakemmarsh@gmail.com>'s awesome code
 *              支持external module和引入module by bundle.require
 *              添加browserify task depends on views task
 *              分别bundle js:vendor/js:app/js:page
 */
'use strict';

var fs = require('fs');

var through = require('through2');

var config = require('../config');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var changed = require('gulp-changed');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var streamify = require('gulp-streamify');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var handleErrors = require('../util/handleErrors');
var runSequence = require('run-sequence');

var glob = require('glob');
var path = require('path');
var gulpBuffer = require('gulp-buffer');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

// var argv = require('yargs').argv;
// var isProduction = !!(argv.env !== 'dev') || global.isProd;

var isProduction = require('../util/nodeEnv')();

// console.log(isProduction, argv.env, argv)

/**
 * Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
 * Nemo rewrite some logic
 * @file [dest name]
 * @opts [object] options
 *       {
 *         entries: [],
 *         require: [],
 *         externals: []
 *       }
 */
function buildScript(file, opts, cb) {
    opts = opts || {};
    cb = cb || function(){};
    var data = {
        entries: [],
        requires: opts.requires || [],
        externals: opts.externals || [],
        debug: !isProduction,
        cache: {},
        packageCache: {},
        fullPaths: !isProduction
    };
    var bundler = browserify(data, watchify.args);

    // var revName = opts.revName || path.basename(file, '.js');

    /**
     * 坑来了！
     * 单独执行bundler.require 会把require的模块，打包到entries的后面
     * 导致如果entries里需要require这些模块时，报找不到模块的错误
     * 把requires当做参数传入browserify()里，就会先打包这些模块，如上面现在做的这样，符合预期
     */
    opts.requires && opts.requires.forEach(function (require, key) {
        bundler.require(require);
    });
    opts.externals && opts.externals.forEach(function (external, key) {
        bundler.external(external);
    });

    opts.entries && opts.entries.forEach(function (entry, key) {
        bundler.add(entry);
    });

    if (!isProduction && !opts.pageScriptFlag) {
        bundler = watchify(bundler);
        bundler.on('update', function () {
            rebundle();
        });

    }

    function rebundle() {
        var stream = bundler.bundle( function(err, src){
            if(opts.pageScriptFlag){
                opts.pageCallback(err, src);
            }
            cb();
        });
        // var createSourcemap = global.isProd && config.browserify.sourcemap;

        gutil.log('Rebundle...');

        //注意browserify里的sourcemap在bundle option.debug=true里设置的
        //do bundle时，如下的sourcemap其实然并卵
        //生产环境不应该有sourcemap，开发阶段生成的sourcemap是browserify bundle后的，没有目录结构

        if(opts.pageScriptFlag){
            return stream.on('error', handleErrors)
                // .pipe(source(file))
                // .pipe(gulpif(createSourcemap, buffer()))
                // .pipe(gulpif(createSourcemap, sourcemaps.init()))
                // .pipe(gulpif(createSourcemap, sourcemaps.write('./')))
                // .pipe(gulpif(isProduction, gulpBuffer()))

        }else {
            return stream.on('error', handleErrors)
                .pipe(source(file))
                // .pipe(gulpif(createSourcemap, buffer()))
                // .pipe(gulpif(createSourcemap, sourcemaps.init()))
                // .pipe(gulpif(createSourcemap, sourcemaps.write('./')))

                .pipe(gulpif(isProduction, streamify(uglify({
                    compress: {drop_console: true}
                }))))

                .pipe(gulpif(isProduction, gulpBuffer()))

                .pipe(gulpif(isProduction, revReplace({
                    manifest: gulp.src(config.rev.fileName)
                })))

                .pipe(gulpif(isProduction, rev()))

                .pipe(gulp.dest(config.scripts.dest))

                .pipe(gulpif(isProduction, rev.manifest(opts.revName? (config.rev.dest + '/manifest_' + opts.revName + '.json'): config.rev.fileName, {
                    cwd: config.src,
                    base: config.rev.dest,
                    merge: true
                })))
                .pipe(gulpif(isProduction, gulp.dest(config.rev.dest)));
        }
    }

    return rebundle();

}

function relPath(base, filePath) {
    if (filePath.indexOf(base) !== 0) {
        return filePath.replace(/\\/g, '/');
    }

    var newPath = filePath.substr(base.length).replace(/\\/g, '/');

    if (newPath[0] === '/') {
        return newPath.substr(1);
    }

    return newPath;
}

function transform(file, enc, cb){
    // pathString = pathString.replace(jsPageSrc, '');
    var self = this;
    // console.log(file);

    var handleFile = function(err, src){
        if(err) {
            // self.emit('error', wrapWithPluginError(err));
        } else {
            // self.emit('postbundle', src);

            file.contents = new Buffer(src);
            self.push(file);
        }
    }
    var opts = {
        entries: [file.path],
        externals: vendorRequires,
        pageScriptFlag: true,
        pageCallback: handleFile
        // revName: path.basename(pathString.replace(/\//g, '_'), '.js')
    }

    buildScript(relPath(file.base, file.path), opts, cb);
};

function pageScriptHandle(){
    return through.obj(transform);
}

var vendorRequires = ['jquery'];
gulp.task('js:vendor', function () {
    // console.log( glob.sync(config.rev.dest+'/manifest*.json', {}));
    return buildScript('vendor.js', {
        entries: [config.src + '/js/vendor.js']
        , requires: vendorRequires
    });
});
gulp.task('js:app', function () {
    // console.log( glob.sync(config.rev.dest+'/manifest*.json', {}));
    return buildScript('app.js', {
        entries: [config.src + '/js/app.js']
        , externals: vendorRequires
    });
})
gulp.task('js:pages', function () {

// views 需要所有assets都执行完生成rev后执行，原glob方式不能保证执行完毕，改成gulp.src
    return gulp.src(config.scripts.pageSrc)

        .pipe(pageScriptHandle())

        .pipe(gulpif(isProduction, revReplace({
            manifest: gulp.src(config.rev.fileName)
        })))

        .pipe(gulpif(isProduction, uglify({
            compress: {drop_console: true}
        })))

        .pipe(gulpif(isProduction, rev()))

        .pipe(gulp.dest(config.scripts.dest))

        .pipe(gulpif(isProduction, rev.manifest(config.rev.fileName, {
            base: config.rev.dest,
            merge: true
        })))
        .pipe(gulpif(isProduction, gulp.dest(config.rev.dest)));

})

gulp.task('browserify', function (cb) {
    runSequence( 'js:vendor', 'js:app', 'js:pages', cb);/*pages 有文件比较大，尽量保证manifest file 生成，把pages放在最前*/
});
