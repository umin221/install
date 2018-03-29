import Vue from 'vue';
import Vuex from 'vuex';
import { app } from 'public/store';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

export default new Vuex.Store({
  modules: {
    app,
    index: {
      namespaced: true,
      state: {
        value: ''
      },
      actions: {
      },
      mutations: {
      }
    },
    add: {
      namespaced: true,
      state: {
        partList: [],
        project: {},
        time: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate()
        }
      },
      actions: {
        /* 设置配件列表
        *  @param {Object} data 必填
        */
        setPartList({state, commit, dispatch}, data) {
          commit('partList', data);
        },
        /* 删除配件列表
        *  @param {Object} index 必填 删除哪一个配件的索引
        */
        deletePart({state, commit, dispatch}, index) {
          state.partList.splice(index, 1);
          var partListData = state.partList;
          commit('partList', partListData);
        },
        /* 设置项目
        *  @param {Object} data 必填
        */
        setProject({state, commit, dispatch}, data) {
          commit('project', data);
        },
        /* 设置日期
        *  @param {Object} data 必填
        */
        setTime({state, commit, dispatch}, time) {
          commit('timeDate', time);
        },
        /* 配件的数量
        *  @param {Object} data 必填
        */
        setpartNum({state, commit, dispatch}, index, sumVal) {
          commit('partSum', index, sumVal);
        }
      },
      mutations: {
        partList(state, data) {
          state.partList = data;
        },
        partSum(state, index, sumVal) {
          state.partList[index].sum = sumVal;
        },
        project(state, data) {
          state.project = data;
        },
        timeDate(state, data) {
          state.time.year = data.year;
          state.time.month = data.month;
          state.time.day = data.day;
        }
      }
    },
    selectParts: {
      namespaced: true,
      state: {
        partList: []
      },
      actions: {
      },
      mutations: {
        partList(state, data) {
          state.partList = data;
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
      }
    }
  }
});
