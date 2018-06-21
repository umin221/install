/**
 * Local Config
 */
config.mapp = {
  // 管理人员，可查看团队信息
  'r2f': {
    'FS Department Manager': 'manager',
    'Field Service Manager': 'manager'
  },
  'manager': {
    '已提交': {status: 'Submitted', list: 'pending'},
    '库存异动': {status: 'Inventory Movement', list: 'valid'},
    '已完成': {status: 'Closed', list: 'invalid'}
  }
};
