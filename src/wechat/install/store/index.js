import api from '../api/api';
import cache from '../api/cache';
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
        getAddress() {
          KND.Native.ajax({
            url: 'http://apis.map.qq.com/ws/geocoder/v1/?location=39.984154,116.307490&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'
          });
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
         * @param {String} lst 选填 结果渲染列表
         * @param {Function} callback 选填 处理回调
         * @param {Function} error 选填 错误回调
         */
        queryInstallTask({state, commit, dispatch}, {data, mode, list, callback}) {
          cache.invoke({
            key: 'queryInstallTask',
            data: data,
            mode: mode,
            success: data => {
              let installTask = data.SiebelMessage.Contact['KL Installation Task'];
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
        building: [],
        layer: []
      },
      mutations: {
        // 填充楼栋
        setLayer(state, layer) {
          state.layer = layer;
        },
        // 填充栋列表
        setBuilding(state, building) {
          state.building = building;
        },
        // 移除楼栋
        remove(state, index) {
          state.assets.splice(index, 1);
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
          let setting = {
            key: 'queryBuilding',
            data: option.data,
            success: data => {
              let building = data.SiebelMessage.Building;
              commit('setBuilding', building);
              // 默认获取第一栋信息
              dispatch('getLayer', {
                'Original Order Id': option.data.OrderId,
                'KL Activity Id': option.data.TaskId,
                'Integration Id 2': building[0].BuildingNum
              });
            }
          };
          cache.invoke(setting);
        },
        /**
         * 获取楼栋下所有楼层&房号
         */
        getLayer({commit}, data) {
          api.get({
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
                TaskId: id,
                BuildingNum: data.BuildingNum,
                Builing: data.BuildingName
              });
            } else {
              tools.success(data, {
                successTips: '更新成功'
              });
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
          api.get(setting);
        },
        /**
         * 绑定资产条码型号等
         */
        installOrderAssets({state}, setting) {
          setting.key = 'installOrderAssets';
          api.get(setting);
        }
      }
    }
  }
};
