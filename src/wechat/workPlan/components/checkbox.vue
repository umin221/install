/**
* @file 复选框
* @author  石
* @date  2018/3/16
*/
<template>
  <div class="check-modle">
    <span class="mint-checkbox">
        <input type="checkbox" class="mint-checkbox-input"  value="jack" @click="change('jack')"> 
        <span class="mint-checkbox-core"></span>
    </span>
  </div>
</template>

<script type="es6">
  export default {
    name: 'checkbox',
    props: {
      checkList: Array
    },
    methods: {
      change(val) {
        event.stopPropagation(); // 阻止跳转详情
        this.$emit('change', val);
      }
    }
  };
</script>

<style scoped>
  .check-modle{
    margin-left: 5px;
  }
  .mint-checkbox-input{
    position: absolute;
    width: 22px;
    height: 22px;
    vertical-align: middle;
    z-index: 2;
    opacity: 0;
    display: block;
  }
</style>
