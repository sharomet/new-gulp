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
	fileInclude = require('gulp-file-include'),
	del = require('del')
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	groupMedia = require('gulp-group-css-media-queries'),
	cleanCss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webphtml = require('gulp-webp-html');
	//webpcss = require('gulp-webpcss');


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
	gulp.watch([path.watch.img], images);
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
}

function clean() {
	return del(path.clean);
}

function html() {
	return src(path.src.html)
		.pipe(fileInclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(groupMedia())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			cascade: true
		}))
		//.pipe(webpcss())
		.pipe(dest(path.build.css))
		.pipe(cleanCss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function js() {
	return src(path.src.js)
		.pipe(fileInclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function images() {
	return src(path.src.img)
		.pipe(webp({
			quality: 70
		}))
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 3 // 0 - 7
		}))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build, watchFiles, browSersync);

exports.js = js;
exports.css = css;
exports.html = html;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;