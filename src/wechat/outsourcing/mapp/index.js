/**
 * Local Config
 */
config.mapp = {
  'manager': {
    'pending': {status: 'Approval Pending', label: '待审批'},
    'valid': {status: 'Active', label: '已生效'}
    // 'invalid': {status: 'Inactive', label: '已失效'}
  },
  'employee': {
    'pending': {status: 'Approval Pending', label: '待审批'},
    'valid': {status: 'Active', label: '已生效'}
  },
  'option': {  // 委外 lov 下拉值列表
    'KL Partner Credentials Type': [], // 证件类型
    'KL Partner Scale': [], // 规模
    'KL Partner Type 2': [] // 公司/个人
  },
  'lovs': { // 委外 lov 清单
    'KL Partner Credentials Type': 'KL_PARTNER_CREDENTIALS_TYPE', // lov 证件类型
    'KL Partner Scale': 'KL_PARTNER_SCALE', // lov 规模
    'KL Partner Type 2': 'KL_PARTNER_TYPE_2' // lov 公司/个人
  },
  'k2v': {
    '有效': 'valid'
  }
};
