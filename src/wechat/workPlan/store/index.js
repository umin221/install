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
        currentYear: 1970,   // 年份
        currentMonth: 1,  // 月份
        currentDay: 1,    // 日期
        firstWeek: 1
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
