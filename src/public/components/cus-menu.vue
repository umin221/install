<template>
  <div class="menu-box">
    <div class="button-group">
      <div @click="cancel" v-text="cancelTxt"></div>
      <div @click="enter">确定</div>
    </div>
    <mt-picker @change="onValuesChange"
               :slots="slots"
               :value-key="vk"></mt-picker>
  </div>
</template>
<script type="es6">
  export default {
    name: 'menu',
    props: ['slots', 'type', 'vk', 'mode'],
    created() {
    },
    data() {
      return {
        value: [],
        value1: ''
      };
    },
    computed: {
//      清除模式
      clearMode() {
        return this.mode === 'clear';
      },
      cancelTxt() {
        return this.clearMode ? '清除' : '取消';
      }
    },
    methods: {
      cancel() {                    // 取消事件
        let me = this;
        let value = {};
        me.$emit('my-cancel', '');
        value[me.vk ? me.vk : 'Value'] = '';
        if (me.clearMode) me.$emit('my-enter', [value], me.type);
      },
      enter() {                     // 确定
        let me = this;
        me.$emit('my-enter', me.value, me.type);
      },
      onValuesChange(picker, values) {
        let me = this;
        me.value = values;
        if (me.value1 !== me.value[0]) {
          me.$emit('my-change', me.value, me.type);
        }
        me.value1 = values[0];
      }
    }
  };
</script>
<style lang="scss">
  .menu-box{
    .button-group{
      background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 1%, transparent 0%);
      display: flex;
    }
    .button-group>div{
      line-height: 2.5rem;
      text-align: center;
      width: 50%;
      color: $theme-color;
    }
    .picker>.picker-items>.slot2{
      display: none;
    }
  }

  .mint-popup{
    width: 100%;
  }
</style>
