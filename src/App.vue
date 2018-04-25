<template>
  <div id="app" :class="platform">
	  <transition :name="transitionName" @afterLeave="clearTransition">
      <keep-alive :include="alive">
		    <router-view></router-view>
      </keep-alive>
	  </transition>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';

  const NameSpace = 'app';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      let platform = KND.Util.getDevice();
      KND.Util.back = () => {
        me.$router.back();
      };
      // 获取用户
      me.getAuthority();
      // 平台风格
      if (platform.IOS) me.platform = 'ios';
      if (platform.android) me.platform = 'android';
    },
    data() {
      return {
        platform: '',
        prevRoutes: []
      };
    },
    watch: {
      /* ========================================
       * Apply Slide Transition Effects For
       * Each Route Switch,Except Some Route That
       * Don't Need Transition Effect
       * ========================================= */
      $route(to, from) {
        let me = this;
        let transition = 'turn';
        // 同一个页面，不做记录
        if (to.name === from.name) return;

        if (to.name === me.prevRoutes[me.prevRoutes.length - 1]) {
          transition = (from.meta.transition || transition) + '-off';
          me.setTransition(transition);
          me.prevRoutes.pop();
        } else {
          if (from.name != null) {
            transition = (to.meta.transition || transition) + '-on';
            me.setTransition(transition);
            me.prevRoutes.push(from.name);
          }
        }
      }
    },
    computed: {
      ...mapState(NameSpace, ['transition', 'transitionName', 'alive'])
    },
    methods: {
      ...mapActions(NameSpace, ['getAuthority']),
      ...mapMutations(NameSpace, ['setTransition', 'setTransitionName']),
      // Clear Transition Effects After Each Switch
      clearTransition() {
        this.setTransition('');
      }
    }
  };
</script>

