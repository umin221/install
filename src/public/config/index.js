'use strict';
import prod from './prod.env';
import dev from './dev.env';

let project = global['project'] || {};
let name;

let config = Object.assign(dev, process.env.NODE_ENV === 'production' ? prod : {}, project);

// 微信公众号 接口地址 & 认证标记 不一样
if (config['mode'] === 'wechat') {
  config.host = 'https://www.kinlong.cn';
  config.appNo = 'KINLONG2013';
};

name = config['name'];
global['config'] = config;
global['context'] = name;
global[name] = {};
