// initialize modules
const {src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

// use dart-sass for @use
sass.compiler = require('sass'); 
// might need dart-sass rather than sass 
// the main reason i used sass instead of dart-sass is because 
// when i installed it says dart-sass has been deprecated and its now just called sass

// sass task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// javascript task
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true })
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }))
}

// browserSync task
function browserSyncServe(cb) {
    browserSync.init({
        server: {
            baseDir: '.',

        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}
function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

// watch task
function watchTask() {
    watch('*.html', browserSyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/js/**/*.js'],
        series(scssTask, jsTask, browserSyncReload)
    );
}

// default gulp task
exports.default = series(
    scssTask,
    jsTask,
    browserSyncServe,
    watchTask
);