<template>
  <div id="app">
	  <transition :name="transitionName" @afterLeave="clearTransition">
      <keep-alive :include="alive">
		    <router-view></router-view>
      </keep-alive>
	  </transition>
  </div>
</template>

<script type="es6">
  import {mapState, mapMutations} from 'vuex';

  const NameSpace = 'app';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      KND.Util.back = () => {
        me.$router.back();
      }
    },
    data() {
      return {
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
      ...mapMutations(NameSpace, ['setTransition', 'setTransitionName']),
      // Clear Transition Effects After Each Switch
      clearTransition() {
        this.setTransition('');
      }
    }
  };
</script>

