'use strict';
import prod from './prod.env';
import dev from './dev.env';

let project = global['project'] || {};
// 环境
let env = project['env'];
// 环境配置
let envConfig = {};
// 项目配置
let config;
let name;
// 是否生产标记
let production = process.env.NODE_ENV === 'production';

/**
 * 环境配置
 * dev: http://192.168.166.8:9001/siebel-rest/v1.0/
 * sit: http://crmsit.kinlong.cn:9003/siebel-rest/v1.0/
 * uat: http://crmuat.kinlong.cn:9007/siebel-rest/v1.0/
 */
switch (env) {
  case 'SIT':
    envConfig.attachServer = 'http://crmsit.kinlong.cn:9003'; // 附件接口服务 SIT环境
    envConfig.context = '/crm/sit/api/';
    envConfig.authorization = 'HELLO'; // 认证模式 认证密码
    break;
  case 'UAT':
    envConfig.attachServer = 'http://crmsit.kinlong.cn:9007'; // 附件接口服务 SIT环境
    envConfig.context = '/crm/uat/api/';
    envConfig.authorization = 'HELLO'; // 认证模式 认证密码
    break;
  default:
    envConfig.attachServer = 'http://192.168.166.8:9001'; // 附件接口服务 开发环境
    envConfig.context = '/crm/dev/api/';
    envConfig.authorization = 'ACCOUNT'; // 认证模式 认证密码
};

config = Object.assign(envConfig, dev, production ? prod : {}, project);
config.isProduction = production;
name = config['name'];

global['config'] = config;
global['context'] = name;
global[name] = {};
