<template>
  <div>
    <div>
      <mt-header fixed title="服务订单详情">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content orderForms">
        <div class="detail-title">
          <div class="mt-Detail-title">维修订单号：{{orderDatail['Order Number']}}</div>
          <div class="mt-Detail-title">服务订单号：{{orderDatail['Service Request Number']}}</div>
          <div class="mt-Detail-title">负责人：{{orderDatail['KL Primary Owner']}}</div>
          <div class="mt-Detail-title">保修期：{{orderDatail['KL Warranty Flag']}}</div>
        </div>
        <div class="detail-content" v-for="(item, index) in lineItems" :key="index">
          <div class="mt-Detail-title">产品名称：{{item['KL Product Name Join']}}</div>
          <div class="mt-Detail-title">型号：{{item['KL Product Model Join']}}</div>
          <div class="mt-Detail-title">单价：CNY {{item['Adjusted List Price - Display']}} x {{item['Quantity Requested']}}</div>
          <div class="mt-Detail-title">订单总额：CNY {{item['NRC CxTotal']}}</div>
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
      this.getDetail(this.$route.query.type);
    },
    data: () => {
      return {
      };
    },
    computed: {
      ...mapState(NameSpace, ['orderDatail', 'lineItems'])
    },
    methods: {
      ...mapActions(NameSpace, ['getDetail'])
    },
    components: {}
  };
</script>
<style lang="scss">
  .orderForms{
    .detail-title{
      font-size: $font-size-large;
      line-height: 2rem;
      background-color: #ffffff;
      padding: 1rem;
    }
    .detail-content{
      margin-top: 1rem;
      background-color: #ffffff;
      padding: 1rem;
      font-size: $font-size-large;
      line-height: 2rem;
    }
  }

</style>
