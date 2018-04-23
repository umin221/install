/**
 * Local Config
 */
config.mapp = {
  'manager': {
    '待处理': {status: 'Draft,Rejected', list: 'pending'},
    '处理中': {status: 'Awaiting Approval,Submitted', list: 'valid'},
    '已完成': {status: 'Closed', list: 'invalid'}
  }
};
