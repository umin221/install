<template>
  <div id="app">
	  <transition :name="transitionName" @afterLeave="clearTransition">
      <keep-alive :include="alive">
		    <router-view></router-view>
      </keep-alive>
	  </transition>
  </div>
</template>

<script type="application/javascript">
  import {mapState, mapMutations} from 'vuex';

  const NameSpace = 'app';
  export default {
    name: NameSpace,
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
        if (!(to.meta.noPageAnimation || from.meta.noPageAnimation)) {
          if (to.name === this.prevRoutes[this.prevRoutes.length - 1]) {
            this.setTransition('turn-off');
            this.prevRoutes.pop();
          } else {
            if (from.name != null) {
              this.setTransition('turn-on');
              this.prevRoutes.push(from.name);
            }
          }
        }
      }
    },
    computed: {
      ...mapState(NameSpace, ['transitionName', 'alive'])
    },
    methods: {
      ...mapMutations(NameSpace, ['setTransition']),
      // Clear Transition Effects After Each Switch
      clearTransition() {
        this.setTransition('');
      }
    }
  };
</script>

