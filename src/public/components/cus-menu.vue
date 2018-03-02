<template>
  <div class="menu-box">
      <div class="button-group">
        <div @click="enter">确定</div>
        <div @click="cancel">取消</div>
      </div>
      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
  </div>
</template>
<script>
  export default {
    name: 'menu',
    props: ['slots'],
    created() {
    },
    data() {
      return {
        value: [],
        value1: ''
      };
    },
    methods: {
      cancel() {                    // 取消事件
        let self = this;
        self.$emit('my-cancel', '');
      },
      enter() {                     // 确定
        let self = this;
        self.$emit('my-enter', self.value);
      },
      onValuesChange(picker, values) {
        let self = this;
        self.value = values;
        if (self.value1 !== self.value[0]) {
          self.$emit('my-change', self.value);
        }
        self.value1 = values[0];
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
  }
</style>
