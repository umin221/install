/**
 * Local Config
 */
config.mapp = {
  'manager': {
    '待处理': '已提交',
    '处理中': '已交接',
    '已完成': '已完成'
  },
  'employee': {
    '待处理': '已交接',
    '已完成': '已完成'
  },
  'list': {
    '已提交': 'pending',
    '已交接': 'process',
    '已完成': 'completed'
  },
  'option': {
    'KL Hole Type': [], // 开孔方式
    'KL Delivery Check Box 1': [{'Value': '是', Key: 'Y'}, {'Value': '否', Key: 'N'}], // 门厂是否安装锁体
    'KL Delivery Check Box 2': [{'Value': '是', Key: 'Y'}, {'Value': '否', Key: 'N'}], // 是否安装替代锁
    'KL Hole Direction': [], // 开向
    'KL_DOOR_MATERIAL_QUALITY': [], // 门材质
    'KL World Flag': [{'Value': '带', Key: 'Y'}, {'Value': '不带', Key: 'N'}] // 是否带天地
  },
  'optionKey': {
    'KL Hole Type': 'Value',
    'KL Delivery Check Box 1': 'Key',
    'KL Delivery Check Box 2': 'Key'
  },
  'kv': {
    'Y': '是',
    'N': '否'
  }
};
