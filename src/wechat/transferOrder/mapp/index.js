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
  'option': {  // 订单行 lov 下拉值列表
    'KL Hole Type': [], // 开孔方式
    'agreementItem': [], // 合同行
    'KL Hole Direction': [], // 开向
    'KL_DOOR_MATERIAL_QUALITY': [], // 门材质
    'KL Gate Plate Specification': [], // 门扣板规格
    'KL Slippery Screen Printing': [], // 滑盖丝印
    'KL Color Card Screen Printing': [], // 彩卡丝印
    'KL Guide Plate Specification': [] // 锁舌导向板规格
  },
  'lovs': { // 订单行 lov 清单
    'KL Door Material Quality': 'KL_DOOR_MATERIAL_QUALITY', // lov 门材质
    'KL Guide Plate Specification': 'KL_GUIDE_PLATE_SPECIFICATION', // lov 锁舌导向板规格
    'KL Gate Plate Specification': 'KL_GUIDE_PLATE_SPECIFICATION', // lov 门扣板规格
    'KL Slippery Screen Printing': 'KL_SCREEN_PRINTING', // lov 滑盖丝印
    'KL Color Card Screen Printing': 'KL_SCREEN_PRINTING' // lov 彩卡丝印
  },
  'k2v': { // checkbox 标记
    'Y': '是',
    'N': '否',
    '': '否'
  },
  'code2group': { // 订单行分类
    'Panel': {group: 'panels', label: '面板'}, // , add: true
    'Lock Body': {group: 'lockBody', label: '锁体'},
//    'VP003': {group: 'VP003', label: '智能锁虚拟产品'},
    'False Lock': {group: 'falseLock', label: '假锁'},
    'Other': {group: 'others', label: '其他'}
  },
  // 可编辑订单状态
  'editOrderStatus': ['Draft', 'Rejected', 'Door Factory Return']
};
