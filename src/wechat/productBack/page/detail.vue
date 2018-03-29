<template>
  <div>
    <div>
      <mt-header fixed title="维修订单详情">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content orderForms">
        <div class="detail-title">
          <div class="mt-Detail-title"><span class="name">申请单：</span><span class="val">ST201712280001</span></div>
          <div class="mt-Detail-title"><span class="name">申请领用人：</span><span class="val">张xxx</span></div>
          <div class="mt-Detail-title"><span class="name">工程替代锁所属项目：</span><span class="val">xxxxxx</span></div>
          <div class="mt-Detail-title"><span class="name">申请领用时间：</span><span class="val">2017-12-28 12:00</span></div>
          <div class="mt-Detail-title"><span class="name">领用说明：</span><span class="val">xxxx</span></div>
          <div class="mt-Detail-title"><span class="name">状态：</span><span class="val">已提交</span></div>
        </div>
        <div class="detail-content">
          <div class="item">
            <div class="mt-Detail-title">配件编码：0010402289A</div>
            <div class="mt-Detail-title">配件名称：xxxxxx</div>
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
      padding: 10px;
      font-size: .75rem;
      line-height: 1.75rem;
      .mt-Detail-title{
        display: flex;
        .name {
          color: #888;
          display: inline-block;
          width: 150px;
          min-width: 150px;
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
      }
    }
  }

</style>
