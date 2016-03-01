'use strict';

var config = require('../config');
var gulp = require('gulp');

gulp.task('watch', /*['browserSync', 'server'],*/ function () {

    // Scripts are automatically watched and rebundled by Watchify inside Browserify task
    gulp.watch(config.scripts.pageSrc, ['js:pages']);
    gulp.watch(config.less.srcAll, ['styles']);
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.src + '/styles/app/icons/**', ['styles']);
    gulp.watch(config.views.watch, ['views']);

});
