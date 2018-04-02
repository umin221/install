<template>
  <div class="menu-box">
    <div class="button-group">
      <div @click="cancel">取消</div>
      <div @click="enter">确定</div>
    </div>
    <mt-picker @change="onValuesChange"
               :slots="slots"
               :value-key="vk"></mt-picker>
  </div>
</template>
<script>
  export default {
    name: 'menu',
    props: ['slots', 'type', 'vk'],
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
        self.$emit('my-enter', self.value, self.type);
      },
      onValuesChange(picker, values) {
        console.log(values);
        let self = this;
        self.value = values;
        if (self.value1 !== self.value[0]) {
          self.$emit('my-change', self.value, self.type);
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
    .picker>.picker-items>.slot2{
      display: none;
    }
  }

  .mint-popup{
    width: 100%;
  }
</style>
