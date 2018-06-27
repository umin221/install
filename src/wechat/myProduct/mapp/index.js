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
  'product': {
    '配件库': {status: 'Parts', list: 'PartsList'},     // To Be Assigned 待分配
    '不良库': {status: 'Bad Parts', list: 'badPartsList'}
  },
  'detail': {
    '入库': {status: 'Destination Inv ID', list: 'DestinationList'},     // To Be Assigned 待分配
    '出库': {status: 'Source Inv ID', list: 'SourceList'}
  }
};
