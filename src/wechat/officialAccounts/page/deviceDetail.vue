<template>
  <div>
    <div class="mint-content">
      <div class="deviceDetail">
        <mt-cell title="产品条形码" :value="assetDetail['Serial Number']"></mt-cell>
        <mt-cell title="产品品牌" :value="assetDetail['KL Brand']"></mt-cell>
        <mt-cell title="产品型号" :value="assetDetail['KL Product Model']"></mt-cell>
        <mt-cell title="保修开始时间" :value="assetDetail['Install Date']"></mt-cell>
        <mt-cell title="保修结束时间" :value="assetDetail['KL Warranty End Date']"></mt-cell>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import menuBox from 'public/components/cus-menu';
//  import { MessageBox } from 'mint-ui';
  const NameSpace = 'deviceDetail';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      me.assetId = me.$route.query.id;
      me.getAssetdetail(me.assetId);
    },
    data: () => {
      return {
        assetId: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['assetDetail'])
    },
    methods: {
      ...mapActions(NameSpace, ['getAssetdetail']),
      submit() {
        this.$router.push('myRepair');
      }
    },
    components: {menuBox}
  };
</script>
<style lang="scss">
  .deviceDetail{
    background-color: #ffffff;
  }
</style>
