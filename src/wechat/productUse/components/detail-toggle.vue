<template>
    <div>
      <div :class="{visible:visible, child: !type, colorN: isTitle,colorY: !isTitle}" class="cus-toggle-btn"
            @click="ck">{{type?title:''}}{{label1}}</div>
      <div :class="{toggleContent:type}" v-show="visible">
        <slot></slot>
      </div>
    </div>
</template>

<script type="es6">
  export default {
    name: 'cus-toggle',
    props: ['label', 'type', 'isTitle', 'index', 'form'],
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
    },
    methods: {
      ck() {
        let me = this;
        me.visible = !me.visible;
        if (me.visible) {
          me.$emit('ck', this.form);
        }
      }
    }
  };

</script>

<style lang="scss">
  .cus-toggle-btn {
    position: relative;
    line-height: 2rem;
    color: #000000;
    font-size: 0.75rem;
    background-color: aliceblue;
    margin-top: 10px;
    border-radius: 5px;
    padding-left: 10px;
    font-weight: bolder;

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
  .toggleContent{
    padding-left: 20px;
  }
  .child{
    font-size: 0.7rem;
    background: lightblue;
  }
  .colorN{
    font-size: 0.75rem;
    background: none;
  }
  .colorY{
    font-size: 0.7rem;
    background: none;
    font-weight: 100;
  }
</style>
