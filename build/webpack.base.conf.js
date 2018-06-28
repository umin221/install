'use strict';
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const mode = process.argv[2];

function resolve (dir) {
  return path.join(__dirname, '..', dir)
};

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

const getCompileModules = () => {
  /*
    * workPlan  — 工作计划，transferOrder — 安装交接单，installOrder  — 安装订单，serviceOrder  — 维修工单，orderForms  — 维修订单
    * myProduct  — 我的配件，productUse  — 配件领用，productBack — 配件退入，outsourcing — 委外人员管理，install — app，officialAccounts — 公众号
    * controller — 待办跳转公共模块，demo — mintUI 部分模板
    */
  /**
   * transferOrder outsourcing demo workbench workPlan installOrder serviceOrder orderForms controller install officialAccounts
   * myProduct productUse productBack
   */
  let modules = fs.readdirSync('./src/wechat'); // ['installOrder']; // fs.readdirSync('./src/wechat'); //
  if (mode) {
    // 编译指定模块
    switch(mode) {
      case 'app':
        config.build.assetsRoot = path.resolve(__dirname, '../src/cordova/installation/www');
        modules = ['install'];
        break;
      case 'wx':
        modules = ['officialAccounts'];
        break;
    };
  };
  console.log(`编译模块如下 ${modules}`);
  return modules;
};

const exclude = {'sign': false, 'public': false, 'demo': false};
const createEntry = () => {
  let entry = {};
  let modules = getCompileModules();
  for (var i = modules.length - 1; i >= 0; i--) {
    let child = modules[i];
    if (exclude[child] === false || child.indexOf('.') !== -1) continue;
    entry[child] = './src/wechat/'+ child +'/main.js';
  }
  return entry;
};

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: createEntry(),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'public': path.resolve(__dirname, '../src/public'),
    },
    modules :["node_modules", path.resolve(__dirname, '../dll')]
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src/public'), resolve('src/wechat')] // [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
