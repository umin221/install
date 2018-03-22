let ApiList = {
};
// 16113009 袁静
// 14080088 张沙沙
// 16013107 代一
// let ajax = (api) => {
//   // eslint-disable-next-line
//   KND.Native.ajax(Object.assign({
//     timeout: 30000,
//     method: 'POST',
//     headers: {
//       'Authorization': 'Basic MTYwMTMxMDc6MTYwMTMxMDc='
//     }
//   }, api));
// };
let ajax = api => {
  if (config.online) {
    KND.Native.ajax(api);
  } else {
  }
};

const get = option => {
  ajax(Object.assign(option, ApiList[option.key](option)));
};

export default {
  get
};
