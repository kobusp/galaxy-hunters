var gulp = require("gulp");
var uglify = require("gulp-uglify");
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var watchify = require('watchify');

gulp.task("default", function () {
  gulp.src("source/client.js")
          .pipe(browserify())
          .pipe(rename("client.min.js"))
          .pipe(uglify())
          .pipe(gulp.dest("public/js"));
});

gulp.task('watchify', ['enable-watch-mode', 'default']);
