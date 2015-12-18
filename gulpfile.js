var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var browserify = require("gulp-browserify");

gulp.task("babelify", function () {
	return gulp.src("src/**/*.js")
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest("./dist"));
});

gulp.task("browserify", ['babelify'],  function () {
	return gulp.src("dist/index.js")
		.pipe(browserify({
			insertGlobals: true
		}))
		.pipe(gulp.dest("."));
});

gulp.task("build", ["browserify"]);

gulp.task("default", ["build"], function () {
	gulp.watch('src/**/*.js', ['build']);
});
