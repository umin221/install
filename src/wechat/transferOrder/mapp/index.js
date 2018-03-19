/**
 * Local Config
 */
config.mapp = {
  'manager': {
    '待处理': {status: '已提交', list: 'pending'},
    '处理中': {status: '已交接', list: 'process'},
    '已完成': {status: '已完成,已驳回', list: 'completed'}
  },
  'employee': {
    '待处理': {status: '已交接', list: 'pending'},
    '已完成': {status: '已完成,已驳回', list: 'completed'}
  },
  'option': {
    'KL Hole Type': [], // 开孔方式
    'agreementItem': [], // 合同行
    'KL Hole Direction': [], // 开向
    'KL_DOOR_MATERIAL_QUALITY': [] // 门材质
  },
  'optionKey': {
    'KL Hole Type': 'Value'
  },
  'k2v': {
    'Y': '是',
    'N': '否'
  }
};
