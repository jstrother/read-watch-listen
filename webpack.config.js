const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './js/scripts.js',
	output: {
		path: `${__dirname}/js`,
		filename: 'scripts-webpack.js'
	},
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: [
					'latest'
				]
			}
		}]
	}
};