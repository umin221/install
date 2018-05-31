'use strict'
const base = 'public/js/base/';
const lib = 'public/js/lib/';
const plugin = 'public/plugin/';
const comps = 'public/components/';

module.exports = {
  base: [`${base}util`, `${base}session`, `${base}event`, `${base}queue`, `${plugin}validator`],
  vendor: ['vue', 'vue-router', 'vuex', 'axios', `${lib}fastclick`, `${lib}vconsole.min`, `${lib}cache`, `${base}mint`],
  components: [`${comps}cus-attach`, `${comps}cus-search`, `${comps}cus-select-city`, `${comps}cus-button-group.vue`, `${comps}cus-lazy.vue`,
    `${comps}cus-call.vue`, `${comps}cus-cell.vue`, `${comps}cus-empty.vue`, `${comps}cus-fallback.vue`, `${comps}cus-field.vue`,
    `${comps}cus-header.vue`, `${comps}cus-loadmore.vue`, `${comps}cus-menu.vue`, `${comps}cus-title-group.vue`, `${comps}cus-toggle.vue`],
};
