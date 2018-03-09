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
        visible: false
      }
    },
    computed: {
      label() {
        return this.visible ? '收起' : '展开'
      }
    }
  }

</script>

<style lang="scss">
  .cus-toggle-btn {
    position: relative;
    text-align: center;
    line-height: 2rem;
    padding-bottom: 10px;
    color: $theme-color;
    font-size: $font-size-small;
    background-color: #fff;

    &.visible:after {
      -webkit-transform: translateX(-50%) rotate(135deg);
      transform: translateX(-50%) rotate(-45deg);
    }

    &:after {
      @include allow;

      top: auto;
      bottom: 12px;
      left: 50%;
      -webkit-transform: translateX(-50%) rotate(135deg);
      transform: translateX(-50%) rotate(135deg);
      transition: transform .4s ease;
    }
  }
</style>
