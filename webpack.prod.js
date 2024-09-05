const { merge } = require('webpack-merge');
const config = require('./webpack.config');
const path = require('path');

module.exports = merge(config, {
	mode: 'production',
	entry: {
		index: './src/index.ts',
	},
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'assets/[name][ext]',
		clean: true,
	},
});
