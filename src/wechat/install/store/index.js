import api from '../api/api';
import cache from '../js/tools.db';
import { app } from 'public/store';

// 缓存页面
app.state.alive = ['index', 'assets'];

export default {
  modules: {
    app,
    login: {
      namespaced: true,
      state: {},
      mutations: {},
      actions: {
        // 查询用户信息，用户登陆使用
        queryUserInfo({state}, setting) {
          setting.key = 'queryUserInfo';
          cache.invoke(setting);
        },
        // 获取最后登录用户的信息
        getCacheUser({state}, setting) {
          setting.key = 'getCacheUser';
          cache.invoke(setting);
        },
        // 清除缓存
        clear() {
          cache.invoke({
            key: 'clear'
          });
        },
        /**
         * 注销登录
         */
        logout({state}, setting) {
          setting.key = 'logout';
          cache.invoke(setting);
        }
      }
    },
    /**
     * 安装批次列表
     */
    index: {
      namespaced: true,
      state: {
        isManager: true,
        // 待处理
        pending: [],
        // 已完成
        completed: [],
        // 搜索结果
        result: []
      },
      mutations: {
        setTask(state, {installTask, list}) {
          state[list] = KND.Util.toArray(installTask);
        }
      },
      actions: {
        /**
         * 获取安装批次列表
         * @param {Object} data 必填 接口请求参数
         * @param {Boolean} more 选填 是否加载更多
         * @param {String} list 选填 结果渲染列表
         * @param {Function} callback 选填 处理回调
         * @param {Function} error 选填 错误回调
         */
        queryInstallTask({state, commit, dispatch}, {key, data, mode, list, callback}) {
          cache.invoke({
            key: key,
            data: data,
            mode: mode,
            success: data => {
              let contact = data.SiebelMessage.Contact;
              let installTask = contact && contact['KL Installation Task'];
              commit('setTask', {installTask, list});
              if (callback) callback(installTask);
            }
          });
        }
      }
    },

    /**
     * 资产信息
     */
    assets: {
      namespaced: true,
      state: {
        building: [{}],
        layer: []
      },
      mutations: {
        // 填充楼栋
        setLayer(state, layer) {
          state.layer = KND.Util.toArray(layer);
        },
        // 填充栋列表
        setBuilding(state, building) {
          state.building = building;
        },
        // 移除楼栋
        remove(state, index) {
          state.building.splice(index, 1);
        },
        // 清空楼栋
        clearLayer(state) {
          state.layer = [];
        }
      },
      actions: {
        /**
         * 获取批次下所有楼栋
         */
        queryBuilding({commit, dispatch}, option) {
          let selected = option.selected || 0;
          let setting = {
            key: 'queryBuilding',
            data: option.data,
            success: data => {
              let building = [];
              if (data.BuildingNumber === '0') {
                MessageBox('提示', '无楼栋信息').then(result => {
                  KND.Util.back();
                });
              } else {
                building = KND.Util.toArray(data.SiebelMessage.Building);
                let index = building.length > selected ? selected : 0;
                // 默认获取第一栋信息
                dispatch('getLayer', {
                  'Original Order Id': option.data.OrderId,
                  'KL Activity Id': option.data.TaskId,
                  'KL Building Number': building[index].BuildingNum
                });
              };
              commit('setBuilding', building);
            }
          };
          cache.invoke(setting);
        },
        /**
         * 获取楼栋下所有楼层&房号
         */
        getLayer({commit}, data) {
          cache.invoke({
            key: 'getLayer',
            data: data,
            success: data => {
              commit('setLayer', data['SiebelMessage']['Asset Room']);
            }
          });
        },
        /**
         * 删除楼栋或楼层
         */
        removeBuilding({state}, setting) {
          setting.key = 'removeBuilding';
          api.get(setting);
        },
        /**
         * 获取本地扫码安装记录
         */
        queryLocalInstallRecord({state}, callback) {
          cache.invoke({
            key: 'queryLocalInstallRecord',
            success: callback
          });
        },
        /**
         * 检测网络并提交数据
         */
        checkAndSubmit() {
          cache.invoke({
            key: 'checkAndSubmit'
          });
        }
      }
    },

    /**
     * 楼层&房号信息
     */
    floor: {
      namespaced: true,
      state: {
        form: ''
      },
      mutations: {
      },
      actions: {
        /**
         * 更新房间信息
         */
        upsertRoom({state}, data) {
          api.get({
            key: 'upsertRoom',
            data: data,
            success: data => {
              tools.success(data, {
                back: true,
                successTips: '更新成功'
              });
              // 标记楼栋资产刷新
              KND.Session.set('refreshAssets', true);
            }
          });
        },
        /**
         * 删除房号
         */
        removeRoom({state}, setting) {
          setting.key = 'removeRoom';
          api.get(setting);
        }
      }
    },

    /**
     * 楼栋信息
     */
    building: {
      namespaced: true,
      state: {
      },
      mutations: {
      },
      actions: {
        /**
         * 添加楼栋，默认添加一栋
         */
        addBuilding({state}, data) {
          api.get({
            key: 'addBuilding',
            data: data,
            success: data => {
              // 标记楼栋资产刷新
              KND.Session.set('refreshAssets', true);
              MessageBox.alert('当前添加楼栋信息不会立刻生效，请稍后查看添加结果', '添加成功').then(data => {
                KND.Util.back();
              });
            }
          });
        },
        /**
         * 批量更新楼栋名字
         */
        updateBuildingName({state}, {upArr, id}) {
          // 更新名字
          let update = (data) => {
            api.get({
              key: 'updateBuildingName',
              data: data,
              success: data => {
                run(upArr.pop());
              }
            });
          };
          //
          let run = (data, result) => {
            if (data) {
              update({
                'Object Id': id,
                'BuildingNum': data.BuildingNum,
                'Builing': data.BuildingName
              });
            } else {
              tools.success(data, {
                successTips: '更新成功'
              });
              // 标记楼栋资产刷新
              KND.Session.set('refreshAssets', true);
            };
          };
          run(upArr.pop());
        }
      }
    },

    /**
     * 安装批次楼栋信息
     */
    detail: {
      namespaced: true,
      state: {
        form: ''
      },
      mutations: {
      },
      actions: {
        /**
         * 查询订单行
         */
        queryOrderLines({state}, setting) {
          setting.key = 'queryOrderLines';
          cache.invoke(setting);
        },
        /**
         * 绑定资产条码型号等
         */
        installOrderAssets({state}, setting) {
          setting.key = 'installOrderAssets';
          setting.success = data => {
            tools.success(data, {
              back: true,
              successTips: '绑定成功'
            });
            // 标记楼栋资产刷新
            KND.Session.set('refreshAssets', true);
          };
          cache.invoke(setting);
        },
        /**
         * 检查条码是否绑定
         * @param {String} setting.serial 条码
         * @param {Function} setting.success 成功回调
         */
        serialHasBind({state}, setting) {
          setting.key = 'serialHasBind';
          cache.invoke(setting);
        }
      }
    }
  }
};
