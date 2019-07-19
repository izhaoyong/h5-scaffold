const gulp = require('gulp')
const fs = require('fs');
const path = require('path');
const nodemon = require('gulp-nodemon')
const sourcemaps = require('gulp-sourcemaps')

const replace = require('gulp-replace');

const concat = require('gulp-concat')
const cssmin = require('gulp-cssmin')
const del = require('del')
const less = require('gulp-less');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');


const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
// const replace = require('gulp-url-replace');
const flatten = require('gulp-flatten');
const cheerio = require('gulp-cheerio');

const babel = require('gulp-babel');
const watch = require('gulp-watch');
const htmlmin = require('gulp-htmlmin');

const rev = require('gulp-rev');
const modifyCssUrls = require('gulp-modify-css-urls');

const revCollector = require('gulp-rev-collector');
const revReplace = require('gulp-rev-replace');
const useref = require('gulp-useref');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');

const browserify = require('gulp-browserify');
const rollup = require('gulp-better-rollup')

const chokidar = require('chokidar');
const execSync = require('child_process').execSync;

// var bundle  = require('gulp-module-bundle');
// var bundler = require('gulp-module-bundler');

const DOMAIN = '//image.soulink.com.cn';
let ENV = 'dev';

const PRODUCTION_API_DOMAIN = 'api.soulink.com.cn'
const DEV_API_DOMAIN = 'dev.soulink.com.cn'
// const DEV_API_DOMAIN = 'api.soulink.com.cn'
const PREVIEW_API_DOMAIN = 'preview.soulink.com.cn'

gulp.task('start', ['html', 'static', 'less', 'image', 'init-js'], function () {
	nodemon({
		script: 'bin/www',
		ext: 'js css html less',
		ignore: ['logs', 'node_modules', 'src', ],
		verbose: true,
		tasks: function (files) {
			var tasks = []
			files.forEach((file) => {
				console.log("changed file=>", file);
				if (path.extname(file).search('js') > -1) {
					replaceDomain(file);
				}
			});
			return tasks
		}
	})
})

function readPagesDir(dir) {
	let options = {
		encoding: 'utf8',
		withFileTypes: false
	};
	let files = fs.readdirSync(dir, options);
	files.forEach(file => {
		let filepath = `${dir}/${file}`;
		let stats = fs.statSync(filepath);
		if (stats.isDirectory()) {
			readPagesDir(filepath);
		} else {
			replaceDomain(filepath)
		}
	});
}

function replaceDomain(filepath) {
	if (filepath.search('public') > 0) {
		let options = {
			encoding: 'utf8'
		};
		let content = fs.readFileSync(filepath, options);
		if (content.search(/REPLACE_DOMAIN/g) >= 0) {
			if (process.env.PORT == 3001) {
				content = content.replace(/REPLACE_DOMAIN/g, PREVIEW_API_DOMAIN);
			} else if (process.env.PORT == 3002) {
				content = content.replace(/REPLACE_DOMAIN/g, PRODUCTION_API_DOMAIN);
			} else {
				content = content.replace(/REPLACE_DOMAIN/g, DEV_API_DOMAIN);
			}
			fs.writeFileSync(filepath, content);
		} else {
			console.log('hahahah');
		}
	}
}

gulp.task('init-js', function () {
	let result = execSync('./node_modules/webpack/bin/webpack.js --display-error-details --config webpack.config.js', {
		encoding: 'utf8'
	});
	let dir = __dirname + '/public/static/js/pages';
	readPagesDir(dir);
	return;
});

gulp.task('prod-js', function () {
	let result = execSync('./node_modules/webpack/bin/webpack.js --display-error-details --config webpack.prod.js', {
		encoding: 'utf8'
	});
	let dir = __dirname + '/public/static/js/pages';
	readPagesDir(dir);
	return;
});



// 处理less文件的变化,首先是将less文件转换成css类型的文件,然后转换后的css文件拷贝到public对应的目录下
// const autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 Chrome versions"] });
function handleCssStaticFile(url, filePath) {
	if (url.startsWith('http')) {
		return url;
	} else if (!url.startsWith('/')) {
		let relative = ''
		if (/(png|jpg|jpeg|bmp|gif|webp)/i.test(url)) {
			relative = filePath.replace(__dirname, '');
			relative = relative.replace('/src', '/static/images/')
			relative = relative.replace(/[^\/]*\.css$/, '');
		} else {
			relative = filePath.replace(__dirname, '');
			relative = relative.replace(__dirname + '/public/static/css/', '/static/images/')
			relative = relative.replace(/[^\/]*\.css$/, '');
		}

		url = path.join(relative, url);
		return url;
	} else {
		return url;
	}
}
gulp.task('less', function () {
	return gulp.src([__dirname + '/src/**/*.less'])
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(modifyCssUrls({
			modify: function (url, filePath) {
				if (url.startsWith('http')) {
					console.log('less =>', url);
					return url;
				} else {
					if (!url.startsWith('/')) {
						let relative = ''
						if (/(png|jpg|jpeg|bmp|gif)/.test(url)) {
							relative = filePath.replace(__dirname, '');
							relative = relative.replace('/src', '/static/images/')
							relative = relative.replace(/[^\/]*\.css$/, '');
						} else {
							relative = filePath.replace(__dirname, '');
							relative = relative.replace(__dirname + '/public/static/css/', '/static/images/')
							relative = relative.replace(/[^\/]*\.css$/, '');
						}
						url = path.join(relative, url);

						return url;
					} else {
						console.log(url);
						return url;
					}
				}
			},
			prepend: '',
			append: ''
		}))
		.pipe(gulp.dest('public/static/css/'))
})
gulp.task('watch:less', function () {
	return watch(__dirname + '/src/**/*.less', () => {
		return gulp.src([__dirname + '/src/**/*.less'])
			.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
			.pipe(less())
			.pipe(autoprefixer())
			.pipe(modifyCssUrls({
				modify: function (url, filePath) {
					return handleCssStaticFile(url, filePath);
				},
				prepend: '',
				append: ''
			}))
			.pipe(gulp.dest('public/static/css/'))
	})
})
gulp.task('build:less', function () {
	return gulp.src([__dirname + '/src/**/*.less'])
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(less())
		.pipe(autoprefixer())
		.pipe(modifyCssUrls({
			// url是css中的图片的地址，filePath是当前css文件的地址
			modify: function (url, filePath) {
				return handleCssStaticFile(url, filePath);
			},
			prepend: DOMAIN,
			append: ''
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('public/static/css/'))
})
gulp.task('build:css', () => {
	return gulp.src(['./rev/**/*.json', __dirname + '/public/**/*.css'])
		.pipe(revCollector())
		.pipe(gulp.dest('public/'))
})


gulp.task('html', () => {
	return gulp.src(__dirname + '/src/**/*.html')
		.pipe(cheerio({
			run: function ($, file) {
				handleHtmlStaticFile('dev', $, file);

				let src = $('#console').attr('src');
				if (src) {} else {
					let last = $('script').last();
					$('<script id="console" src="/static/js/lib/vconsole.min.js" type="text/javascript"></script>').insertBefore(last);
					$('<script>window.vConsole = new window.VConsole();console.log("Hello world");</script>').insertAfter('#console')
				}

			},
			parserOptions: {
				decodeEntities: false
			}
		}))
		.pipe(gulp.dest('views/'))
})
gulp.task('watch:html', () => {
	return watch(__dirname + '/src/pages/**/*.html', () => {
		return gulp.src(__dirname + '/src/**/*.html')
			.pipe(cheerio({
				run: function ($, file) {
					handleHtmlStaticFile('dev', $, file);

					let src = $('#console').attr('src');
					if (src) {} else {
						let last = $('script').last();
						$('<script id="console" src="/static/js/lib/vconsole.min.js" type="text/javascript"></script>').insertBefore(last);
						$('<script>window.vConsole = new window.VConsole();console.log("Hello world");</script>').insertAfter('#console')
					}
				},
				parserOptions: {
					decodeEntities: false
				}
			}))
			.pipe(gulp.dest('views/'))
	})
})


function handleHtmlStaticFile(env, $, file) {
	let domain = "";
	if (env == 'prod') {
		domain = DOMAIN;
	}

	console.log(file.base);
	let relative = file.path.replace(file.base, '');
	console.log(relative);
	relative = relative.replace(/[^\/]*\.html$/, '');
	console.log(relative);

	$('script').each((index, item) => {
		let src = item.attribs.src;
		if (src) {
			if (src.startsWith('http')) {} else {
				if (src.startsWith('.')) {
					src = path.join('/static/js/', relative, src);
					console.log(src)
					item.attribs.src = `${domain}${src}`;
				} else {
					item.attribs.src = `${domain}${src}`;
				}
			}
		}
	});

	$('link').each((index, item) => {
		let src = item.attribs.href;
		if (src) {
			if (src.startsWith('http')) {} else {
				if (!src.startsWith('/')) {
					src = path.join('/static/css/', relative, src);
				}
				src = src.replace(/less$/, 'css');
				item.attribs.href = `${domain}${src}`;
			}
		}
	})

	$('img').each((index, item) => {
		let src = item.attribs.src || '';
		if (src.startsWith('http')) {} else {
			if (src.includes('{{')) {} else {
				if (!src.startsWith('/')) {
					src = path.join('/static/images/', relative, src);
				}
				item.attribs.src = `${domain}${src}`;
			}
		}
	})
}

const options = {
	removeComments: true, //清除HTML注释
	collapseWhitespace: true, //压缩HTML
	collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
	removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
	removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
	removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
	minifyJS: true, //压缩页面JS
	minifyCSS: true //压缩页面CSS
};
gulp.task('build:html', () => {
	return gulp.src(['./rev/**/*.json', __dirname + '/src/**/*.html'])
		.pipe(cheerio({
			run: function ($, file) {
				handleHtmlStaticFile('prod', $, file);
			},
			parserOptions: {
				decodeEntities: false
			}
		}))
		.pipe(revCollector())
		.pipe(htmlmin(options))
		.pipe(gulp.dest('dist/views/'))
})

gulp.task('image', () => {
	return gulp.src([__dirname + '/src/**/*.{png,jpg,jpeg,gif,svg,webp}', '!' + __dirname + '/src/static/*.{png,jpg,jpeg,gif,svg,webp}'])
		.pipe(gulp.dest('public/static/images'))
})
gulp.task('watch:image', () => {
	return watch(__dirname + '/src/pages/**/*.{png,jpg,jpeg,gif,svg,webp}', () => {
		return gulp.src([__dirname + '/src/**/*.{png,jpg,jpeg,gif,svg, webp}', '!' + __dirname + '/src/static/*.{png,jpg,jpeg,gif,svg,webp}'])
			.pipe(gulp.dest('public/static/images'))
	})
})

gulp.task('build:page:image', () => {
	return gulp.src([__dirname + '/src/**/*.{png,jpg,jpeg,gif,svg, webp}', '!' + __dirname + '/src/static/**/*.{png,jpg,jpeg,gif,svg,webp}'])
		.pipe(rev())
		.pipe(gulp.dest('public/static/images'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./rev/page/image'));
})
gulp.task('build:page:image:no-hash', () => {
	return gulp.src([__dirname + '/src/**/*.{png,jpg,jpeg,gif,svg,webp}', '!' + __dirname + '/src/static/**/*.{png,jpg,jpeg,gif,svg,webp}'])
		.pipe(gulp.dest('public/static/images'))
})

gulp.task('static', function () {
	return gulp.src(__dirname + '/src/static/**')
		.pipe(gulp.dest('public/static'))
})
gulp.task('watch:static', function () {
	return watch(__dirname + '/src/static/**', () => {
		return gulp.src(__dirname + '/src/static/**')
			.pipe(gulp.dest('public/static'))
	});
})


gulp.task('build:static:image', () => {
	return gulp.src(__dirname + '/src/static/images/**')
		.pipe(rev())
		.pipe(gulp.dest('public/static/images'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./rev/static/image'));
})
gulp.task('build:static:image:no-hash', () => {
	return gulp.src(__dirname + '/src/static/images/**')
		.pipe(gulp.dest('public/static/images'))
})

gulp.task('build:static:css', () => {
	return gulp.src(__dirname + '/src/static/css/**')
		.pipe(cleanCSS())
		.pipe(gulp.dest('public/static/css'))
})
gulp.task('build:static:js', () => {
	return gulp.src([__dirname + '/src/static/js/**/*.js', '!' + __dirname + '/src/static/js/**/*.min.js'])
		.pipe(replace(/REPLACE_DOMAIN/g, PRODUCTION_API_DOMAIN))
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(uglify())
		.pipe(gulp.dest('public/static/js'))
})
gulp.task('build:static:js-min', () => {
	return gulp.src([__dirname + '/src/static/js/**/*.min.js'])
		.pipe(gulp.dest('public/static/js'))
})

gulp.task('jstest', () => {
	return gulp.src([__dirname + '/src/static/js/**/*.js'])
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('test'))
})


gulp.task('build:hash', () => {
	return gulp.src(__dirname + '/public/**')
		.pipe(rev())
		.pipe(gulp.dest('dist'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./rev/dist'));
})

gulp.task('delUnnecessary', () => {
	return del.sync(['rev/', 'public/', 'dist/']);
})

gulp.task('delRev', () => {
	return del.sync(['rev/', 'dist/views/dist/'])
})

gulp.task('delImages', () => {
	return del.sync(['public/static/images/'])
})

gulp.task('dev:js', () => {
	return watch(__dirname + '/src/**/*.js', () => {
		execSync('./node_modules/webpack/bin/webpack.js --display-error-details --config webpack.config.js', {
			encoding: 'utf8'
		});
	})
})
gulp.task('preview:js', () => {
	return watch(__dirname + '/src/**/*.js', () => {
		let result = execSync('./node_modules/webpack/bin/webpack.js --display-error-details --config webpack.config.js', {
			encoding: 'utf8'
		});
		console.log(result);
	})
})


gulp.task('modifyUrls', () =>
	gulp.src([__dirname + '/public/**/*.css'])
	.pipe(modifyCssUrls({
		modify: function (url, filePath) {
			if (!url.startsWith('/')) {
				let relative = ''
				if (/(png|jpg|jpeg|bmp|gif)/.test(url)) {
					relative = filePath.replace(__dirname + '/public/static/images/', '/static/images/')
					console.log("1>", relative)
					relative = relative.replace(/[^\/]*\.css$/, '');
					console.log("2>", relative)
					// relative = relative.replace(/css/g, 'images');
				} else {
					console.log("0>", filePath)
					relative = filePath.replace(__dirname + '/public/static/css/', '/static/images/')
					console.log("1>", relative)
					relative = relative.replace(/[^\/]*\.css$/, '');
					console.log("2>", relative)
				}
				console.log(url, ">");
				url = path.join(relative, url);
				console.log(url);

				return url;
			}
		},
		prepend: '',
		append: ''
	})).pipe(gulp.dest('public/'))
);


gulp.task('testhtml', function () {
	return gulp.src(['./rev/**/*.json', __dirname + '/src/**/*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('test/views/'))
})
