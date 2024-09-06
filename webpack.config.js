const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
	entry: './src/index.ts',
	resolve: {
		alias: { '@': path.resolve(__dirname, 'src') },
		extensions: ['.ts', '.html', '.js'],
		fallback: {
			path: require.resolve('path-browserify'),
			fs: false,
		},
	},

	optimization: {
		minimizer: [
			// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
			`...`,
			new CssMinimizerPlugin(),
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.sharpMinify,
					options: {
						encodeOptions: {
							// Your options for `sharp`
							// https://sharp.pixelplumbing.com/api-output
						},
					},
				},
			}),
		],
		// minimize: true
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Hot Module Replacement',
			template: './src/template.html',
		}),
		new MiniCssExtractPlugin({
			filename: 'main.[hash].css',
		}),
		new CopyPlugin({
			patterns: [{ from: './src/assets/game', to: '.' }],
		}),
		new Dotenv(),
	],

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.html$/i,
				use: 'html-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			// {
			// 	test: /\.(png|svg|jpg|gif|ico)$/i,
			// 	type: 'asset/resource',
			// 	exclude: /node_modules/,
			// },
			// {
			// 	test: /\.(jpe?g|png)$/i,
			// 	type: 'asset',
			// },
		],
	},
};
