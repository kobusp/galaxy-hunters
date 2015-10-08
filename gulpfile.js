var gulp = require("gulp");
var uglify = require("gulp-uglify");
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var watchify = require('watchify');
//var source = require('vinyl-source-stream');
//var buffer = require('vinyl-buffer');
//var sourcemaps = require('gulp-sourcemaps');
//var gutil = require('gulp-util');
//var templateCache = require('gulp-angular-templatecache');
//var concat = require("gulp-concat");
//var maps = require("gulp-sourcemaps");
//var plugins = require('gulp-load-plugins')();


//
//var watching = false;
//gulp.task('enable-watch-mode', function () {
//  watching = true;
//});

gulp.task("default", function () {
  gulp.src("source/client.js")
          .pipe(browserify())
          .pipe(rename("client.min.js"))
          .pipe(uglify())
          .pipe(gulp.dest("public/js"));
});

//gulp.task("template", function () {
//  var options = {templateHeader: 'angular.module("webcontactApp").run(["$templateCache", function($templateCache) {'};
//  return gulp.src('./source/webcontact/templates/*.html')
//          .pipe(templateCache("template.js", options))
//          .pipe(gulp.dest('./source/webcontact'));
//});

//gulp.task('concat', function () {
//  return gulp.src(["./source/webcontact/app.js", "./source/webcontact/template.js"])
////          .pipe(maps.init())
//          .pipe(concat('app.js'))
////          .pipe(uglify())
////          .pipe(plugins.ngAnnotate())
////          .pipe(maps.write('./'))
//          .pipe(gulp.dest('./js/webcontact/'));
//});

gulp.task('watchify', ['enable-watch-mode', 'default']);
//gulp.task("default", ["api", "template", "concat"]);
