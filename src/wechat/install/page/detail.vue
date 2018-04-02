<!--详情、新增、编辑等页面复用-->
<template>
  <div>
    <mt-header fixed title="安装扫码">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toSearchFn" slot="right">保存</mt-button>
    </mt-header>
  </div>
</template>

<script type="es6">
  const NAMESPACE = 'detail';
  export default {
    name: NAMESPACE,
    // 初始化
    created() {
    },
    data: () => {
      return {
      };
    },
    computed: {},
    methods: {}
  };
</script>

<style lang="scss">
  .wide-form {
    .mint-cell-title {
      width: 130px;
    }

    .multiple {
      .mint-cell-title {
        font-size: $font-size-small;
      }
    }
  }

  .mint-content {
    margin-bottom: 2.8rem;
  }
</style>
