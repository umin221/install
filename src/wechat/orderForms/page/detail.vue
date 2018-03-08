<template>
  <div>
    <div>
      <mt-header fixed title="维修订单详情">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content orderForms">
        <div class="detail-title">
          <div class="mt-Detail-title">维修订单号：ST201712280001</div>
          <div class="mt-Detail-title">服务订单号：SR201712280001</div>
          <div class="mt-Detail-title">负责人：李好好 16013107</div>
          <div class="mt-Detail-title">保修期：保内</div>
        </div>
        <div class="detail-content">
          <div class="mt-Detail-title">产品名称：锁舌导向板A组件</div>
          <div class="mt-Detail-title">型号：S050</div>
          <div class="mt-Detail-title">单价：CNY 100.000</div>
          <div class="mt-Detail-title">订单总额：CNY 0.000</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  //
  const NameSpace = 'detail';
  //
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
      };
    },
    computed: {
      ...mapState(NameSpace, [])
    },
    methods: {
      ...mapActions(NameSpace, [])
    },
    components: {}
  };
</script>
<style lang="scss">
  .orderForms{
    .detail-title{
      background-color: #ffffff;
      padding: 1rem;
    }
    .detail-content{
      margin-top: 1.5rem;
      background-color: #ffffff;
      padding: 1rem;
    }
  }

</style>
