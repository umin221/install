<template>
    <div>
      <div :class="{visible:visible, child: !type}" class="cus-toggle-btn"
        @click="visible=!visible">{{type?title:''}}{{label1}}</div>
      <div class="toggle-content" v-show="visible">
        <slot></slot>
      </div>
    </div>
</template>

<script type="es6">
  export default {
    name: 'cus-toggle',
    props: ['label', 'type'],
    data() {
      return {
        visible: false,
//        label1: this.label,
        title: '单据编号:'
      };
    },
    computed: {
      label1() {
        return this.label;
      }
    }
  };

</script>

<style lang="scss">
  .cus-toggle-btn {
    position: relative;
    line-height: 2rem;
    color: #000000;
    font-size: $font-size-large;
    background-color: aliceblue;
    margin-top: 10px;
    border-radius: 5px;

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
  .toggle-content{
    padding-left: 20px;
  }
  .child{
    font-size: 0.75rem;
    background: lightblue;
  }
</style>
