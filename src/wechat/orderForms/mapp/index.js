/**
 * Local Config
 */
config.mapp = {
  // 管理人员，可查看团队信息
  'r2f': {
    'FS Department Director': 'manager', //
    'FS Department Manager': 'manager', // 部长
    'Field Service Manager': 'manager' // 安装主管
  },
  'manager': {
    '已提交': {status: 'Submitted', list: 'pending'},
    '库存异动': {status: 'Inventory Movement', list: 'valid'},
    '已完成': {status: 'Closed', list: 'invalid'}
  }
};
