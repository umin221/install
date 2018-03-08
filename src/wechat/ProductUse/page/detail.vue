<template>
  <div>
    <div>
      <mt-header fixed title="维修订单详情">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content orderForms">
        <div class="detail-title">
          <div class="mt-Detail-title">申请单：ST201712280001</div>
          <div class="mt-Detail-title">申请领用人：张xxx</div>
          <div class="mt-Detail-title">工程替代锁所属项目：xxxxxx</div>
          <div class="mt-Detail-title">申请领用时间：2017-12-28 12:00</div>
          <div class="mt-Detail-title">领用说明：xxxx</div>
          <div class="mt-Detail-title">状态：已提交</div>
        </div>
        <div class="detail-content">
          <div class="mt-Detail-title">配件编码：0010402289A</div>
          <div class="mt-Detail-title">配件名称：xxxxxx</div>
          <div class="mt-Detail-title">配件编码：0010402289A</div>
          <div class="mt-Detail-title">配件名称：xxxxxx</div>
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
