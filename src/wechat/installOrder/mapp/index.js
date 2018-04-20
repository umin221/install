/**
 * Local Config
 */
config.mapp = {
  'manager': {
    '待处理': 'In Confirming',
    '处理中': 'In Installing,Sales Confirmed',
    '已完成': 'Closed,Cancelled'
  },
  'list': {
    'In Confirming': 'pending',
    'In Installing,Sales Confirmed': 'process',
    'Closed,Cancelled': 'completed'
  },
  'option': {
    'KL Detail Type': 'Value',
    'panel': [], // 合同行
    'lockBody': [] // 合同行
  },
  'code2group': {
    'Panel': {group: 'panels', label: '面板', add: true},
    'Lock Body': {group: 'lockBody', label: '锁体', add: true},
    'VP003': {group: 'VP003', label: '智能锁虚拟产品'},
    'False Lock': {group: 'falseLock', label: '假锁'},
    'Other': {group: 'others', label: '其他'}
  }
};
