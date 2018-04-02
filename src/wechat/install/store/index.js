import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/api';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

// 每页加载条数
const PAGESIZE = config.pageSize;
// mapp
let mapps = config.mapp['manager'];

export default new Vuex.Store({
  modules: {
    app,
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
        setPartners(state, {partners, list}) {
          state[list] = partners;
        },
        addPartners(state, {partners, list}) {
          state[list].push(...partners);
        },
        setManager(state, isManager) {
          mapps = config.mapp[isManager ? 'manager' : 'employee'];
          state.isManager = isManager;
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
        getPartners({state, commit, dispatch}, {data, more, lst, callback, error}) {
          let mapp = mapps[data['KL Partner Status']] || {};
          let list = lst || mapp.list;
          data['KL Partner Status'] = mapp.status;

          api.get({
            key: 'queryPartners',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: data => {
              let partners = KND.Util.toArray(data.SiebelMessage['Channel Partner']);
              commit(more ? 'addPartners' : 'setPartners', {
                partners: partners,
                list: list
              });
              if (callback) {
                callback(partners);
              }
            },
            error
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
        assets: [],
        layer: []
      },
      mutations: {
        setLayer(state, layer) {
          state.layer = layer;
        },
        setBuilding(state, assets) {
          state.assets = assets;
        },
        remove(state, index) {
          state.assets.splice(index, 1);
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
              let assets = data.SiebelMessage.Building;
              commit('setBuilding', assets);
              // 默认获取第一栋信息
              dispatch('getLayer', {
                'KL Activity Id': option.data.id,
                'Integration Id 2': assets[0].BuildingNum
              });
            }
          };
          api.get(setting);
        },
        /**
         * 获取楼栋下所有楼层&房号
         */
        getLayer({commit}, data) {
          api.get({
            key: 'getLayerSort', // 'findTransferOrderById', //
            data: data,
            success: data => {
              commit('setLayer', data['SiebelMessage']['Asset Room']);
            }
          });
        },
        /**
         * 删除楼栋或楼层
         */
        deleteBuilding({state}, setting) {
          setting.key = 'deleteBuilding';
          api.get(setting);
        }
      }
    },

    /**
     * 楼层&房间
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
      }
    }
  }
});
