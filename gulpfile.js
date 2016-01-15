/**
 * Function to log the Loading Time
 */
const logTime = (startTime => {

    const prettyTime = require('pretty-hrtime');
    const chalk = require('chalk');
    const gutil = require('gulp-util');

    return () => {
        var time = prettyTime(process.hrtime(startTime));
        gutil.log(
            'Finished', '\'' + chalk.yellow('Loading Tasks') + '\'',
            'after', chalk.magenta(time)
        );
    }
})(process.hrtime());



//--------------------------------------------------------------------------\\
//     Load gulp                                                            \\
//--------------------------------------------------------------------------\\
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

gulp.task('build', () => {
    return gulp.src('src/*.jsx')
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(gulp.dest('dist'))
        .pipe(uglify({
            preserveComments: 'license',
            compress: {
                drop_console: true
            }
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('watch', ['build'], () => {
    gulp.watch('src/*.jsx', ['build']);
});

gulp.task('default', ['build']);

//Log loading time
logTime();
