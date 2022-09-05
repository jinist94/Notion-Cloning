const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv').config();

module.exports = (_, argv) => {
  const isDevelopment = argv.mode !== 'production';

  return {
    entry: './src/index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'public'),
      publicPath: '/',
      // clean: true,
    },
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        util: path.resolve(__dirname, 'src/util'),
      },
      extensions: ['.js'],
    },
    devServer: {
      static: './',
      port: 3000,
      hot: true,
      historyApiFallback: {
        index: '/index.html',
      },
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              compact: !isDevelopment,
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './index.html' }),
      new MiniCssExtractPlugin({ filename: 'style.css' }),
      // new webpack.EnvironmentPlugin(Object.keys(dotenv.parsed || {})),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(dotenv.parsed),
        'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
        'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
      }),
      new webpack.EnvironmentPlugin(['BASE_URL']),
    ],
    performance: {
      hints: false,
    },
  };
};
