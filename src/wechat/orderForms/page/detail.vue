<template>
  <div>
    <div>
      <mt-header fixed title="服务订单详情">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content orderForms">
        <div class="detail-title">
          <div class="mt-Detail-title"><span class="name">维修订单号：</span><span class="val">{{orderDatail['Order Number']}}</span></div>
          <div class="mt-Detail-title"><span class="name">服务订单号：</span><span class="val">{{orderDatail['Service Request Number']}}</span></div>
          <div class="mt-Detail-title"><span class="name">EBS订单编号：</span><span class="val">{{orderDatail['Back Office Order Number']}}</span></div>
          <div class="mt-Detail-title"><span class="name">WMS订单编号：</span><span class="val">{{orderDatail['KL WMS Order Number']}}</span></div>
          <div class="mt-Detail-title"><span class="name">负责人：</span><span class="val">{{orderDatail['KL Primary Owner']}}</span></div>
          <div class="mt-Detail-title"><span class="name">保修期：</span><span class="val">{{orderDatail['KL Warranty Flag']}}</span></div>
        </div>
       <!-- <div class="detail-content" v-for="(item, index) in lineItems" :key="index">
          <div class="mt-Detail-title">产品名称：{{item['KL Product Name Join']}}</div>
          <div class="mt-Detail-title">型号：{{item['KL Product Model Join']}}</div>
          <div class="mt-Detail-title">单价：CNY {{item['Adjusted List Price - Display']}} x {{item['Quantity Requested']}}</div>
          <div class="mt-Detail-title">订单总额：CNY {{item['NRC CxTotal']}}</div>
        </div>-->
        <div class="detail-content">
          <div class="item"
               v-for="(item, index) in lineItems"
               :key="index">
            <div class="mt-Detail-title">产品名称：{{item['KL Product Name Join']}}</div>
            <div class="mt-Detail-title">型号：{{item['KL Product Model Join']}}</div>
            <div class="mt-Detail-title">单价：CNY {{item['Adjusted List Price - Display']}} x {{item['Quantity Requested']}}</div>
            <div class="mt-Detail-title">订单总额：CNY {{item['NRC CxTotal']}}</div>
          </div>
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
      background-color: #ffffff;
      padding: 10px;
      font-size: .75rem;
      line-height: 1.75rem;
      .mt-Detail-title{
        display: flex;
        .name {
          color: #888;
          display: inline-block;
        }
        .val {
          word-break: break-all;
        }
      }
    }
    .detail-content{
      margin-top: 10px;
      background-color: #ffffff;
      padding: 10px;
      .item {
        font-size: .75rem;
        line-height: 1.75rem;
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 1%, transparent 0%);
      }
    }
  }

</style>
