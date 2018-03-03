<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
<!--
      <mt-button slot="right" @click.native="huan">切换</mt-button>
-->
    </mt-header>
    <div class="mint-content">
      <mt-cell title="产品名称">
        <span>{{lockDetail.productName}}</span>
      </mt-cell>
      <mt-cell title="开向">
        <span>{{lockDetail.producOpenTo}}</span>
      </mt-cell>
      <mt-cell title="是否带天地" v-show="lockVal">
        <span>{{lockDetail.productDTD}}</span>
      </mt-cell>
      <mt-cell title="交货日期">
        <span>{{lockDetail.productDate}}</span>
      </mt-cell>
      <mt-cell title="数量">
        <span>{{lockDetail.productNum}}</span>
      </mt-cell>
      <mt-cell title="门材质">
        <span>{{lockDetail.productMaterial}}</span>
      </mt-cell>
      <div v-if="lockVal">
        <mt-cell title="门厚">
          <span>{{lockDetail.productThick}}</span>
        </mt-cell>
        <mt-cell title="锁舌导向板规格">
          <span>{{lockDetail.productSSGG}}</span>
        </mt-cell>
        <mt-cell title="门扣板规格" v-show="lockVal">
          <span>{{lockDetail.productMKGG}}</span>
        </mt-cell>
      </div>
      <div v-if="lockVal==false">
            <mt-cell title="滑盖丝印">
              <span>{{lockDetail.productPrintH}}</span>
            </mt-cell>
            <mt-cell title="彩卡丝印">
              <span>{{lockDetail.productPrintC}}</span>
            </mt-cell>
      </div>
      <mt-cell title="配件要求">
        <span>{{lockDetail.productParts}}</span>
      </mt-cell>
      <mt-field label="备注"  type="textarea" rows="4"></mt-field>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script type="application/javascript">
  export default {
    name: 'detail',
    created: () => {
      var self = this;
      self.id = self.$route.query.id;
      self.type = self.$route.query.type;
      if (self.type === '锁体') {
        self.lockVal = false;
        self.titleVal = '锁体部分*真锁';

      } else {
        self.lockVal = true;
        self.titleVal = '锁芯部分';

      }
    },
    data: () => {
      return {
        titleVal: '锁芯部分',
        id: '', // id
        type: '', // 区分锁芯还是锁体
        lockVal: true, // lockVal=true 锁芯， lockVal=false 锁体
        active: 'tab-container',
        lockDetail: {
          productName: 'SX30-3锁芯成品',
          producOpenTo: '左外开',
          productDTD: '带',
          productDate: '2018-01-12',
          productNum: '100',
          productMaterial: '钢门',
          productThick: '0.1',
          productPrintH: '标配',
          productPrintC: '标配',
          productSSGG: '26*300',
          productMKGG: '28*300',
          productParts: '标配',
          remarks: '备注'

        }
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    methods: {
    }
  };
</script>
