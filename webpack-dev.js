const chokidar = require('chokidar');
const execSync = require('child_process').execSync;

// One-liner for current directory, ignores .dotfiles
chokidar.watch(__dirname + '/src/**/*.js', {})
	.on('all', (event, path) => {
		let result = execSync('./node_modules/webpack/bin/webpack.js --display-error-details --config webpack.config.js', {
			encoding: 'utf8'
		});
		console.log(result);
	});
