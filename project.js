/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description project configuration file
 */
var project = {
//  Environment => DEV SIT UAT PROD
  env: 'UAT',
//  Is it possible to call the WeChat API
  wxJSBridge: false,
//  Debug switch to view app log
  debug: false,
//  SMS channel
  shortMsg: {
    account: 'gdjlwj',
    password: 'Net263gdjl'
  },
//  SYS manager
  manager: [
//    补充uat人员
    '16113009', '18031034', '17080258', '14080088', '16043106', '16043210', '16093001', '18010190', '16043215', '17053018',
//    培训业务人员
    '18010225', '16043202', '13030172', '16043218', '15063016', '15120017', '16033164', '11040118', '17023089',
//    业务部长
    '14083015', '10080387', '13070453', '1651',
//    坚朗 技术团队
    '12090020', '14123015', '17063108', '17063032', '18031439', '13030901', '16123001', '16023067'
  ]
};
