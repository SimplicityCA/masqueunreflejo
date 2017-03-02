var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');

gulp.task('less', function(){
	return gulp.src('./styles/*.less')
  .pipe(concat('master.css'))
  .pipe(less())
  .pipe(gulp.dest('./dist/styles'));
});
gulp.task('default', ['less']);