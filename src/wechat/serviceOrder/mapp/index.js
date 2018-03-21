/**
 * Local Config
 */
config.mapp = {
  'install': {
    '待处理': {status: 'To Be Assigned,Closed,Cancelled', list: 'pending'},
    '处理中': {status: 'Dispatched,In Progress', list: 'process'},
    '已完成': {status: 'Completed,Already Surveyed', list: 'completed'}
  },
  'custom': {
    'all': {status: '', list: 'cusService'}
  }
};
