'use strict';
export default {
  'name': 'KND',
  'version': '1.0',
  'description': 'for kinlong',
  'author': 'umin',
  'online': true,
  'private': true,
  'debug': true, // 调试模式
  'host': 'https://kas.kinlong.cn:8090', // sit: 'http://crmsit.kinlong.cn:9003', // dev: 'http://192.168.166.8:9001'
  'context': '/crm/dev/api/', // dev: '/crm/dev/api/', // /siebel-rest/v1.0/
  'proxy': 'https://kas.kinlong.cn:8090', // 坚朗代理授权服务器
  'pageSize': 10, // 列表分页默认大小
  'appNo': 'CONTACT', // 企业微信 CONTACT / 微信公众号 KINLONG2013
  'mode': 'company', // company 企业微信 / wechat 微信
  'authorization': 'ACCOUNT', // siebel 认证模式，除dev环境为 帐号:帐号 , 其他环境为 帐号:HELLO  ACCOUNT
  'cacheExp': 60 * 60 * 24 // cache exp
};
