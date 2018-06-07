'use strict';
const webpack = require('webpack');
const path = require('path');
const config = require('../config');
const utils = require('./utils');
const vueLoaderConfig = require('./vue-loader.conf');
const source = config.build.assetsPublicSourcePath;
const dist = path.join(config.build.assetsPublicOutputRoot);

function resolve (dir) {
  return path.join(__dirname, '..', dir)
};

module.exports = {
//    入口文件配置
  entry: config.library,
//    文件导出的配置
  output: {
    path: dist,
    filename: `[name].dll.js`,
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(dist, '[name].manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: {comments: false},
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'public': source
    },
    modules: ["node_modules", dist]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src/public'), resolve('src/wechat')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }
    ]
  }
};
