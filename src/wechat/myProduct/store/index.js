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
        setManager(state, isManager) {
          mapps = config.mapp['product'];
          state.isManager = isManager;
        },
        setTeam(state, isTeam) {
          state.isTeam = isTeam;
          // 清空列表数据
          state.PartsList = [];
          state.badPartsList = [];
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
          data['ViewMode'] = state.isManager ? (state.isTeam ? 'Manager' : 'Personal') : 'Personal';
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
        setTeam(state, isTeam) {
          state.isTeam = isTeam;
          // 清空列表数据
          state.DestinationList = [];
          state.SourceList = [];
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
