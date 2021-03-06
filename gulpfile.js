/*global require*/
"use strict";

var gulp = require('gulp'),
  path = require('path'),
  data = require('gulp-data'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  fs = require('fs');

/*
 * Directories here
 */
var paths = {
  public: './public/',
  sass: './src/sass/',
  css: './public/css/',
  data: './src/_data/index.pug.json'
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
 gulp.task('pug:data', function() {
     return gulp.src('./src/**/*.json')
         .pipe(merge('data.json', function(json, file) {

             // Extract the filename and strip the extension
             var filename = path.basename(file.path),
                 primaryKey = filename.replace(path.extname(filename), '');

             // Set the filename as the primary key for our JSON data
             var data = {};
             data[primaryKey.toUpperCase()] = json;

             return data;
         }))
         .pipe(gulp.dest('/temp'));
 });

gulp.task('pug', function () {
  return gulp.src([
      './src/**/*.pug',
      '!./src/_layouts/*.pug',
      '!./src/_partials/*.pug'
    ])
    .pipe(data(function (file) {
      return require(paths.data);
    }))
    .pipe(pug())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })

    .pipe(gulp.dest(paths.public));
});
gulp.task('build', ['pug:data'], function() {
    return gulp.src('./src/**/*.pug')
        .pipe(data(function() {
            return JSON.parse(fs.readFileSync('/temp/data.json'))
        }))
        .pipe(pug({
            pretty: true,
            basedir: './'
        }))
        .pipe(gulp.dest('/dist'));
});
/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('rebuild', ['pug'], function () {
  browserSync.reload();
});

/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'pug'], function () {
  browserSync({
    server: {
      baseDir: paths.public
    },
    notify: false
  });
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
  return gulp.src(paths.sass + '*.scss')
    .pipe(sass({
      includePaths: [paths.sass],
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/**
 * Watch scss files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.scss', ['sass']);
  gulp.watch('./src/**/*.pug', ['rebuild']);
});

// Build task compile sass and pug.
gulp.task('build', ['sass', 'pug']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch']);
