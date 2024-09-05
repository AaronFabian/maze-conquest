const { merge } = require('webpack-merge');
const config = require('./webpack.config');
const path = require('path');

module.exports = merge(config, {
	mode: 'development',
	entry: './src/index.ts',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'assets/[name].[hash][ext]',
		clean: true,
	},
	// watch: true,
	devServer: {
		static: {
			directory: path.join(__dirname, 'src'),
		},
		compress: true,
		liveReload: true,
		hot: true,
	},
});
