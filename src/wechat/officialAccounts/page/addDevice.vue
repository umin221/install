<template>
  <div>
    <div class="mint-content">
      <div class="addDevice">
        <mt-field label="产品条形码"
                  v-model="klsn"
                  class="klsn"
                  @change.native="search"
                  placeholder="请输入条形码" >
            <i class="xs-icon icon-scan" @click="toScan"></i>
        </mt-field>
        <mt-cell title="产品品牌" value="坚朗海贝斯"></mt-cell>
        <mt-cell title="产品型号" :value="productModel"></mt-cell>
        <mt-cell title="保修开始时间" :value="warrantyStarDate"></mt-cell>
        <mt-cell title="保修结束时间" :value="warrantyEndDate"></mt-cell>
        <button-group>
          <mt-button class="single" @click.native="submit">提交</mt-button>
        </button-group>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import menuBox from 'public/components/cus-menu';
//  import { MessageBox } from 'mint-ui';
  const NameSpace = 'addDevice';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      me.ContactId = me.$route.query.id;
      console.log(me.ContactId);
    },
    data: () => {
      return {
        ContactId: '',
        klsn: '',
        productModel: '',
        warrantyStarDate: '',
        warrantyEndDate: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['assetDetail'])
    },
    methods: {
      ...mapActions(NameSpace, ['getAssetSn', 'setContactAsset']),
      submit() {
        let me = this;
//        console.log(me.assetDetail);
        me.setContactAsset({
          ContactId: me.ContactId,
          AssetId: me.assetDetail.Id,
          callback: function(data) {
            if (data) {
              me.$router.back();
            }
          }
        });
      },
      search() {
        let me = this;
//        me.getAssetSn({
//          klsn: me.klsn,
//          callback: function(data) {
//            me.productModel = data['KL Product Model'];
//          }
//        });
        me.getAssetSn({
          klsn: me.klsn,
          callback: function(data) {
            me.klsn = data['Serial Number'];
            me.productModel = data['KL Product Model'];
            me.warrantyStarDate = data['Install Date'];
            me.warrantyEndDate = data['KL Warranty End Date'];
          }
        });
      },
      toScan() {
        let me = this;
        KND.Native.scanQRCode({
          success(data) {
            let resultStr = data.resultStr.split(',')[1];
            me.klsn = resultStr;
            me.search();
          }
        });
      }
    },
    components: {menuBox}
  };
</script>
<style lang="scss">
  .deviceDetail{
    background-color: #ffffff;
  }
  .klsn>.mint-cell-wrapper>.mint-cell-value>input{
    margin-right: 0.5rem;
  }
</style>
