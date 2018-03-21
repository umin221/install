/**
 * Local Config
 */
config.mapp = {
  'manager': {
    '待处理': {status: 'Pending Approval', list: 'pending'},
    '处理中': {status: 'Accepted', list: 'process'},
    '已完成': {status: 'Closed,Rejected', list: 'completed'}
  },
  'employee': {
    '待处理': {status: 'Accepted', list: 'pending'},
    '已完成': {status: 'Closed,Rejected', list: 'completed'}
  },
  'option': {
    'KL Hole Type': [], // 开孔方式
    'agreementItem': [], // 合同行
    'KL Hole Direction': [], // 开向
    'KL_DOOR_MATERIAL_QUALITY': [] // 门材质
  },
  'k2v': {
    'Y': '是',
    'N': '否'
  }
};
