var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ""
        }
    });
});

// Dev task with browserSync
gulp.task('dev', ['browserSync'], function() {
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('*.js', browserSync.reload);
});