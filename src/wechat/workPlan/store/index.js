import Vue from 'vue';
import Vuex from 'vuex';
import { app } from 'public/store';
import api from '../api/api';

Vue.use(Vuex);

// 缓存页面
app.state.alive = ['index'];

export default new Vuex.Store({
  modules: {
    app,
    index: {
      namespaced: true,
      state: {
        currentYear: 1970,   // 年份
        currentMonth: 1,  // 月份
        currentDay: 1,    // 日期
        firstWeek: 1,
        listData: [],
        currentDayData: [] // 当日数据
      },
      actions: {
        setYear({state, commit, dispatch}, year) {
          commit('currentYear', year);
        },
        setMonth({state, commit, dispatch}, month) {
          commit('currentMonth', month);
        },
        setDay({state, commit, dispatch}, day) {
          commit('currentDay', day);
        },
        setWeek({state, commit, dispatch}, week) {
          commit('firstWeek', week);
        },
        /* 根据日期获取整月数据数据
        * @param {String} start 必填 开始时间
        * @param {String} end 必填 结束时间
        * * @param {Function} callback 选填 回调函数
        */
        getListData({state, commit, dispatch}, {start, end, callback}) {
          api.get({
            key: 'getList',
            data: {
              start: start,
              end: end
            },
            success: data => {
              commit('listData', data.items);
              callback && callback(data.items);
            }
          });
        },
        /* 获取当天数据数据
        * @param {Object} data 必填
        * * @param {Function} callback 选填 回调函数
        */
        getCurrentDayData({state, commit, dispatch}, time, callback) {
          api.get({
            key: 'getCurrData',
            data: time,
            success: data => {
              commit('currentDayData', KND.Util.toArray(data.items));
              callback && callback(data.items);
            }
          });
        },
        /* 获取当天数据数据
        * @param {Object} data 必填
        * * @param {Function} callback 选填 回调函数
        */
        setCurrentDayData({state, commit, dispatch}, data) {
          commit('currentDayData', data);
        },
        /* 删除计划
        * @param {String} id 必填 id
        * @param {String} index 必填 删除第几条的索引
        * @param {Function} callback 选填 回调函数
        */
        deletePlan({state, commit, dispatch}, {id, index, callback}) {
          api.get({
            key: 'delete',
            data: {
              Id: id
            },
            success: data => {
              commit('deleteData', index);
              callback && callback(data.items);
            }
          });
        }
      },
      mutations: {
        currentYear(state, year) {
          state.currentYear = year;
        },
        currentMonth(state, month) {
          state.currentMonth = month;
        },
        currentDay(state, day) {
          state.currentDay = day;
        },
        firstWeek(state, week) {
          if (week === 0) {
            state.firstWeek = 7;
          } else {
            state.firstWeek = week;
          }
        },
        listData(state, data) {
          state.listData = data;
        },
        currentDayData(state, data) {
          state.currentDayData = data;
        },
        deleteData(state, index) {
          state.currentDayData.splice(index, 1);
        }
      }
    },
    detail: {
      namespaced: true,
      state: {
        workDescDate: { // 工作描述
          Value: '请选择描述'
        },
        allDay: false, // 是否全天
        startPickerValue: '', // 计划开始时间
        endPickerValue: '',  // 计划结束时间
        ACstartPickerValue: '', // 实际开始时间
        ACendPickerValue: '',  // 实际结束时间
        startHour: '00' // 结束时间最小选择范围
      },
      mutations: {
        workDesc(state, workDesc) {
          state.workDescDate = workDesc;
        },
        dayAll(state, isAll) {
          state.allDay = isAll;
          state.startHour = '00'; // 取消结束时间限制
        },
        startPicker(state, time) {
          state.startPickerValue = time;
        },
        endPicker(state, time) {
          state.endPickerValue = time;
        },
        ACstartPicker(state, time) {
          state.ACstartPickerValue = time;
        },
        ACendPicker(state, time) {
          state.ACendPickerValue = time;
        },
        startHour(state, time) {
          state.startHour = time;
        }
      },
      actions: {
        /**
         * 选择描述
         * @param {Object} data 描述数据
         */
        setWorkDesc({state, commit, dispatch}, data) {
          commit('workDesc', data);
        },
        /**
         * 是否设置全天
         * @param {Boolean} isAll 描述数据
         */
        setDayAll({state, commit, dispatch}, isAll) {
          commit('dayAll', isAll);
        },
        /**
         * 选择开始时间
         * @param {String} time 时间字符串
         */
        setStartPicker({state, commit, dispatch}, time) {
          commit('startPicker', time);
        },
        /**
         * 选择结束时间
         * @param {String} time 时间字符串
         */
        setEndPicker({state, commit, dispatch}, time) {
          commit('endPicker', time);
        },
        /**
         * 选择实际开始时间
         * @param {String} time 时间字符串
         */
        setACStartPicker({state, commit, dispatch}, time) {
          commit('ACstartPicker', time);
        },
        /**
         * 选择实际结束时间
         * @param {String} time 时间字符串
         */
        setACEndPicker({state, commit, dispatch}, time) {
          commit('ACendPicker', time);
        },
        /**
         * 限制结束时间的最小值
         * @param {String} time 时间字符串
         */
        setStartHour({state, commit, dispatch}, time) {
          commit('startHour', time);
        }
      }
    }
  }
});
