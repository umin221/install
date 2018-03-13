<template>
    <div class="cus-empty" v-text="tips"></div>
</template>

<script type="es6">
  export default {
    name: 'cus-empty',
    props: {
      tips: {
        type: String,
        default: '暂无数据'
      }
    },
    data() {
      return {};
    }
  };
</script>

<style lang="scss">
  .cus-empty {
    font-size: $font-size-small;
    color: $gray-minor;
    background-color: #fff;
    line-height: 40px;
    padding: 0 10px;
    text-align: center;
  }
</style>
