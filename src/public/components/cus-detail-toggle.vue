<template>
    <div class="cus-toggle">
      <div :class="{visible:visible}" class="cus-toggle-btn"
        @click="visible=!visible">{{label}}</div>
      <div v-show="visible">
        <slot></slot>
      </div>
    </div>
</template>

<script type="es6">
  export default {
    name: 'cus-toggle',
    data() {
      return {
        visible: false,
        label: this.label
      };
    },
    props: ['label'],
    computed: {
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
