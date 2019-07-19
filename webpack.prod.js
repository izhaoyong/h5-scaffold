// webpack.config.js
const path = require('path')

var webpack = require("webpack");
const glob = require('glob');

function resolve(dir) {
	return path.join(__dirname, dir)
}


var config = {
	mode: 'production',
	entry: {},
	output: {
		path: __dirname + '/public/',
		filename: (bundle) => {
			// console.log(bundle.chunk.name);
			let name = './static/js/' + bundle.chunk.name.replace('src', '');
			return `${name}.js`;
		}

	},
	resolve: {
		extensions: ['.js'],
		alias: {
			'@': resolve('src'),
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: { presets: ['env'] }
            },
			{
				test: /\.tpl$/,
				loader: "html-tpl"
            }
        ]
	},
	plugins: [],
	optimization: {
		minimize: true
	},
	watch: false
};

/**
 * find entries
 */
var files = glob.sync(__dirname + '/src/pages/**/*.js');
var newEntries = files.reduce(function (memo, file) {
	// var name = /.*\/(.*?)\/index\.js/.exec(file)[1];
	var name = file.replace(__dirname, '');
	name = name.replace('.js', '');
	memo[name] = '.' + name;
	return memo;
}, {});

config.entry = Object.assign({}, config.entry, newEntries);


module.exports = config;
