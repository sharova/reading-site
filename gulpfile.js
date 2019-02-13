'use strict';

const dir = {
  src: './src/',
  build: './build/'
};

const { series, parallel, src, dest, watch } = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const del = require('del');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const ghpages = require('gh-pages');
const path = require('path');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const csso = require('gulp-csso');
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html');

function styles() {
  return src(`${dir.src}scss/style.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: ['last 2 version'], grid: true}),
    ]))
    .pipe(csso())
    .pipe(sourcemaps.write('/'))
    .pipe(dest(`${dir.build}css/`))
    .pipe(browserSync.stream());
}
exports.styles = styles;

function copyHTML() {
  return src(`${dir.src}*.html`)
    .pipe(plumber())
    .pipe(webpHTML())
    .pipe(dest(dir.build));
}
exports.copyHTML = copyHTML;


function copyImg() {
  return src(`${dir.src}img/**/*.{jpg,jpeg,png,gif,svg,webp}`)
    .pipe(plumber())
    .pipe(dest(`${dir.build}img/`));
}
exports.copyImg = copyImg;

function buildSvgSprite() {
  return src(`${dir.src}img/svg/*.svg`)
    .pipe(svgmin(function (file) {
      return {
        plugins: [{
          cleanupIDs: { minify: true }
        }]
      }
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(dest(`${dir.build}img/`));
}
exports.buildSvgSprite = buildSvgSprite;


function copyVendorsJs() {
  return src([
    'node_modules/picturefill/dist/picturefill.min.js',
    'node_modules/svg4everybody/dist/svg4everybody.min.js',
    ])
    .pipe(dest(`${dir.build}js/`));
}
exports.copyVendorsJs = copyVendorsJs;

function copyFonts() {
  return src(`${dir.src}fonts/**/*.{woff2,woff}`)
    .pipe(plumber())
    .pipe(dest(`${dir.build}fonts/`));
}
exports.copyFonts = copyFonts;

function javascript() {
  return src(`${dir.src}js/script.js`)
    .pipe(plumber())
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'script.js',
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
        // externals: {
        //   jquery: 'jQuery'
        // }
    }))
    .pipe(dest(`${dir.build}js`))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(`${dir.build}js`));
}
exports.javascript = javascript;

function clean() {
  return del(dir.build)
}
exports.clean = clean;

function deploy(cb) {
  ghpages.publish(path.join(process.cwd(), dir.build), cb);
}
exports.deploy = deploy;

function serve() {
  browserSync.init({
    server: dir.build,
    startPath: 'index.html',
    open: false,
    port: 8080,
  });
  watch(`${dir.src}scss/**/*.scss`, {delay: 200}, styles);
  watch(`${dir.src}*.html`).on('change', series(copyHTML, browserSync.reload));
  watch(`${dir.src}js/**/*.js`).on('change', series(javascript, browserSync.reload));
  watch(`${dir.src}img/svg/*.svg`).on('all', series(javascript, browserSync.reload));
}


exports.default = series(
  clean,
  parallel(styles, copyHTML, copyImg, buildSvgSprite, copyFonts, copyVendorsJs, javascript),
  serve
);
