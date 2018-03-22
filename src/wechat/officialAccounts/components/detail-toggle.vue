<template>
    <div>
      <div :class="{visible:visible}" class="cus-toggle-btn"
        @click="visible=!visible">{{label1}}:{{ServiceRequest['SR Number']}}</div>
      <div v-show="visible">
        <slot></slot>
      </div>
    </div>
</template>

<script type="es6">
  import {mapState} from 'vuex';
  export default {
    name: 'cus-toggle',
    props: ['label'],
    data() {
      return {
        visible: false,
        label1: this.label
      };
    },
    computed: {
      ...mapState('detail', ['ServiceRequest'])
    }
  };

</script>

<style lang="scss">
  .cus-toggle-btn {
    position: relative;
    line-height: 2rem;
    color: #000000;
    font-size: $font-size-large;
    background-color: #fff;

    &.visible:after {
      -webkit-transform: translateX(-50%) rotate(135deg);
      transform: translateX(-50%) rotate(-45deg);
    }

    &:after {
      @include allow;
      border-color: $theme-color;
      width: 12px;
      height: 12px;
      top: 10px;
      -webkit-transform: translateX(-50%) rotate(135deg);
      transform: translateX(-50%) rotate(135deg);
      transition: transform .4s ease;
    }
  }
</style>
