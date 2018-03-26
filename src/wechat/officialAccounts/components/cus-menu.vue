<template>
  <div class="menu-box">
    <div class="button-group">
      <div @click="cancel">取消</div>
      <div @click="enter">确定</div>
    </div>
    <div class="menu-content">
      <mt-picker @change="onValuesChange"
                 :slots="slots"></mt-picker>
      <mt-picker @change="onValuesChange1"
                 :slots="slots1"></mt-picker>
      <mt-picker @change="onValuesChange2"
                 :slots="slots2"></mt-picker>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'menu',
    props: ['slots', 'slots1', 'slots2'],
    created() {
    },
    data() {
      return {
        value: [],
        value1: [],
        value2: [],
        values: ''
      };
    },
    methods: {
      cancel() {                    // 取消事件
        let self = this;
        self.$emit('my-cancel', '');
      },
      enter() {                     // 确定
        let self = this;
        let values = {
          'KL_PROVINCE': self.value[0] ? self.value[0] : '',
          'KL_CITY': self.value1[0] ? self.value1[0] : '',
          'KL_TOWN': self.value2[0] ? self.value2[0] : ''
        };
        self.$emit('my-enter', values);
      },
      onValuesChange(picker, values) {
        let self = this;
        self.value = values;
        if (self.values !== self.value[0]) {
          self.$emit('my-change', self.value);
        }
        self.values = values[0];
      },
      onValuesChange1(picker, values) {
        let self = this;
        self.value1 = values;
        self.$emit('my-change1', self.value1);
      },
      onValuesChange2(picker, values) {
        let self = this;
        self.value2 = values;
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
    .menu-content{
      display: flex;
      justify-content: center;
      .picker{
        width: 30%;
      }
      .picker>.picker-items>.slot2{
        display: none;
      }
    }
  }
  .mint-popup{
    width: 100%;
  }
</style>
