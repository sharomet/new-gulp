let projectFolder = 'dist',
	sourceFolder = 'src';

let path = {
	build: {
		html: projectFolder + '/',
		css: projectFolder + '/css/',
		js: projectFolder + '/js/',
		img: projectFolder + '/img/',
		fonts: projectFolder + '/fonts/',
	},
	src: {
		html: [
			sourceFolder + '/html/*.html',
			'!' + sourceFolder + '/html/_*.html'
		],
		css: sourceFolder + '/scss/style.scss',
		js: sourceFolder + '/js/script.js',
		img: sourceFolder + '/img/**/*.{jpg,png,gif,ico,webp,svg}',
		fonts: sourceFolder + '/fonts/*.ttf',
	},
	watch: {
		html: sourceFolder + '/html/**/*.html',
		css: sourceFolder + '/scss/**/*.scss',
		js: sourceFolder + '/js/**/*.js',
		img: sourceFolder + '/img/**/*.{jpg,png,gif,ico,webp,svg}',
	},
	clean: './' + projectFolder + '/'
}

let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileInclude = require('gulp-file-include');


function browSersync(params) {
	browsersync.init({
		server: {
			baseDir: './' + projectFolder + '/'
		},
		port: 3000,
		notify: false
	});
}

function watchFiles() {
	gulp.watch([path.watch.html], html);
}

function html() {
	return src(path.src.html)
	.pipe(fileInclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

let build = gulp.series(html);
let watch = gulp.parallel(build, watchFiles, browSersync);

exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;