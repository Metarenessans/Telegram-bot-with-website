const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');

// CSS

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');

// JS

const webpack = require('webpack-stream');
const TerserPlugin = require('terser-webpack-plugin');
const babel = require('gulp-babel');

const sync = require('browser-sync');

// HTML

const html = () =>
  gulp.src('src/*.html')
    .pipe(gulp.dest('public'))
    .pipe(sync.stream());

// CSS

const css = () =>
  gulp.src('src/sass/style.s[ac]ss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss([
      require('postcss-custom-properties')(),
      require('autoprefixer')(),
      require('cssnano')()
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/css'))
    .pipe(sync.stream());

// JS

const js = () =>
  gulp.src('src/js/index.js')
    .pipe(webpack({
      mode: 'production',
      devtool: 'source-map',
      entry: './src/js/index.js',
      output: {
        filename: 'index.js'
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
          terserOptions: {
            format: {
              comments: false
            }
          },
          extractComments: false
        })]
      }
    }))
    .pipe(gulp.dest('public/js'))
    .pipe(sync.stream());

// Clean

const clean = () =>
  del([
    'public/js/**',
    'public/css/**',
    'public/lib/**',
    'public/img/**',
    'public/fonts/**'
  ]);

// Copy

const copy = () => 
  gulp.src([
    'src/lib/**',
    'src/img/**',  
    'src/fonts/**'  
  ], { base: 'src' })
    .pipe(gulp.dest('public'))
    .pipe(sync.stream());

// Watch

const watch = () => {
  gulp.watch('src/*.html',  gulp.series(html));
  gulp.watch('src/sass/**', gulp.series(css));
  gulp.watch('src/js/**',   gulp.series(js));
  gulp.watch([
    'src/img/**',
    'src/fonts/**'
  ], gulp.series(clean, copy));
};

// Server

const server = () => {
  sync.init({
    server: {
      baseDir: './public'
    },
    ui: false,
    notify: false
  });
};

// Default task

exports.default = gulp.series(
  gulp.parallel(html, css, js, clean, copy),
  gulp.parallel(watch, server)
);