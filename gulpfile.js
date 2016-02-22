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

const
    gulp = require('gulp'),
    rename = require('gulp-rename');

const
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify');

const
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano');



gulp.task('build:js', () => {
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

gulp.task('build:css', () => {
    return gulp.src('src/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({ browsers: ['last 2 versions'] }),
            cssnano({ zindex: false })
        ]))
        .pipe(gulp.dest('dist'))
});


gulp.task('watch', ['build'], () => {
    gulp.watch('src/*.jsx', ['build:js']);
    gulp.watch('src/*.scss', ['build:css']);
});

gulp.task('build', ['build:js', 'build:css']);
gulp.task('default', ['build']);

//Log loading time
logTime();
