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
        let leaveTransition;
        if (!(to.meta.noPageAnimation || from.meta.noPageAnimation)) {
          if (to.name === me.prevRoutes[me.prevRoutes.length - 1]) {
            leaveTransition = me.transition[1];
            me.setTransition(leaveTransition);
            me.prevRoutes.pop();
            if (leaveTransition !== 'turn-off') {
              me.setTransitionName(['turn-on', 'turn-off']);
            }
          } else {
            if (from.name != null) {
              me.setTransition(me.transition[0]);
              me.prevRoutes.push(from.name);
            }
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

