import Vue from 'vue';
import Vuex from 'vuex';
import { app } from 'public/store';
import api from '../api/api';

Vue.use(Vuex);
//
let mapps;
const PAGESIZE = config.pageSize;

// 缓存页面
app.state.alive = ['index'];

export default new Vuex.Store({
  modules: {
    app,
    index: {
      namespaced: true,
      state: {
        PartsList: [],
        badPartsList: [],
        result: [],
        isTeam: false,
        isManager: false
      },
      mutations: {
        setData(state, {dataList, list}) {
          state[list] = dataList;
        },
        addData(state, {dataList, list}) {
          state[list].push(...dataList);
        },
        setManager(state, position) {
          mapps = config.mapp['product'];
          // 管理人员(mapp中配置)，可查看团队配件
          state.isManager = config.mapp.r2f[position] === 'manager';
        },
        setList(state) {
          // 清空列表数据
          state.PartsList = [];
          state.badPartsList = [];
        },
        setTeam(state, isTeam) {
          state.isTeam = isTeam;
        }
      },
      actions: {
        getList({state, commit}, {data, more, callback, error}) {
          let status = data['Status'];
          let mapp = mapps[status] || {};
          // 搜索时，没有状态
          let list = mapp['list'] || 'result';

          data['Status'] = mapp['status'];
          // ViewMode 随当前状态切换
          data['ViewMode'] = state.isTeam ? 'Manager' : 'Personal';
          api.get({
            key: 'getList',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              let productList = KND.Util.toArray(data['SiebelMessage']['KL FS Invloc Product']);
              if (productList) {
                commit(more ? 'addData' : 'setData', {
                  dataList: productList,
                  list: list
                });
              }
              if (callback) {
                callback(productList);
              }
            },
            error
          });
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
        DestinationList: [],
        SourceList: []
      },
      mutations: {
        setData(state, {dataList, list}) {
          state[list] = dataList;
        },
        addData(state, {dataList, list}) {
          state[list].push(...dataList);
        },
        setManager(state, isManager) {
          mapps = config.mapp['detail'];
        },
        setList(state) {
          // 清空列表数据
          state.DestinationList = [];
          state.SourceList = [];
        },
        setTeam(state, isTeam) {
          state.isTeam = isTeam;
        }
      },
      actions: {
        getDetail({state, commit}, {data, more, callback, error}) {
          let status = data['Status'];
          let mapp = mapps[status] || {};
          // 搜索时，没有状态
          let list = mapp['list'] || 'result';

          data['Status'] = mapp['status'];
          console.log(data);
          api.get({
            key: 'getDetail',
            data: data,
            paging: {
              StartRowNum: more ? state[list].length : 0,
              PageSize: PAGESIZE
            },
            success: function(data) {
              console.log(data);
              let productList = KND.Util.toArray(data['items']);
              if (productList) {
                commit(more ? 'addData' : 'setData', {
                  dataList: productList,
                  list: list
                });
              }
              if (callback) {
                callback(productList);
              }
            },
            error
          });
        }
      }
    }
  }
});
