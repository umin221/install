<template>
  <transition name="mint-indicator">
    <div class="mint-indicator" v-show="visible">
      <div class="mint-indicator-wrapper" :style="{ 'padding': text ? '20px' : '15px' }">
        <spinner class="mint-indicator-spin" :type="convertedSpinnerType" :size="32"></spinner>
        <span class="mint-indicator-text" v-show="text">{{ text }}</span>
      </div>
      <div class="mint-indicator-mask" @touchmove.stop.prevent></div>
    </div>
  </transition>
</template>

<style lang="scss">
  body {
    >.mint-indicator {
      display: none;
    }

    .mint-indicator {
      position: relative;
      z-index: 1;
    }
  }
</style>

<script type="es6">
  import {Spinner} from 'mint-ui';

  export default {
    created() {
      let me = this;
      Indicator.process = (option) => {
        if (option === false) {
          setTimeout(() => {
            me.visible = false;
          }, 1000);
        } else {
          me.visible = true;
          me.text = option.text;
        }
      };
    },
    data() {
      return {
        visible: false,
        text: '加载中'
      };
    },

    components: {
      Spinner
    },

    computed: {
      convertedSpinnerType() {
        switch (this.spinnerType) {
          case 'double-bounce':
            return 1;
          case 'triple-bounce':
            return 2;
          case 'fading-circle':
            return 3;
          default:
            return 0;
        }
      }
    },

    props: {
      spinnerType: {
        type: String,
        default: 'snake'
      }
    }
  };
</script>
