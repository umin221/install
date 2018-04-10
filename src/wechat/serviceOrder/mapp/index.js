/**
 * Local Config
 */
config.mapp = {
  'install': {
    '待处理': {status: 'To Be Assigned,Dispatched', list: 'pending'},
    '处理中': {status: 'In Progress', list: 'process'},
    '已完成': {status: 'Completed,Already Surveyed,Closed,Cancelled', list: 'completed'}
  },
  'custom': {
    '待处理': {status: 'To Be Assigned,Not Started', list: 'cusPending'},
    '已分配': {status: '', list: 'cusProcess'}
  },
  'option': {
    'KL_LOCK_MODEL': [], // 面板
    'KL_LOCK_BODY_MODEL': [], // 锁体
    'KL_SR_RESP': [],
    'SR_ROOTCAUSE': []
  }
};
