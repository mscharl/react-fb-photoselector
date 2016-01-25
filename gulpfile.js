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
    args = require('minimist')(process.argv.slice(2)),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    gulpif = require('gulp-if');

const
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util');

const
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano');

const
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');


const
    reactCompile = require('./_tasks/react-compiler.js');



gulp.task('build:html', () => {
    return gulp.src('src/html/**/*.html')
        .pipe(reactCompile())
        .pipe(gulp.dest('./'));
});

gulp.task('build:js', () => {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: './src/js/app.jsx',
        debug: !args.production
    });

    b.external(['react','react-dom']);

    return b
        .transform("babelify", {presets: ["es2015", "react"]})
        .transform("browserify-shim", {global: true})
        .bundle()
        .pipe(plumber())
        .pipe(source('./src/js/app.jsx'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(gulpif(args.production, uglify()))
        .pipe(rename({dirname: './', extname: '.js'}))
        .pipe(gulpif(!args.production,sourcemaps.write('./')))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('build:css', () => {
    return gulp.src('src/sass/styles.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({ browsers: ['last 2 versions'] }),
            cssnano()
        ]))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('build:img', () => {
    return gulp.src('src/img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'))
});


gulp.task('watch', ['build'], () => {
    gulp.watch('src/sass/**/*.scss', ['build:css']);
    gulp.watch('src/js/**/*.jsx', ['build:js']);
    gulp.watch(['src/html/**/*.html','src/js/Components/**/*.jsx'], ['build:html']);
    gulp.watch('src/img/**/*', ['build:img']);
});

gulp.task('build', ['build:css', 'build:js', 'build:html', 'build:img']);
gulp.task('default', ['build']);

//Log loading time
logTime();
