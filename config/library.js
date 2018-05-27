'use strict'
const base = 'public/js/base/';
const lib = 'public/js/lib/';
const plugin = 'public/plugin/';

module.exports = {
  base: [`${base}util`, `${base}session`, `${base}event`, `${base}queue`, `${plugin}validator`],
  vendor: ['vue', 'vue-router', 'vuex', 'axios', `${lib}fastclick`, `${lib}vconsole.min`, `${lib}cache`, `${base}mint`]
};
