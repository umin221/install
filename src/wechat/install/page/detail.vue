<template>
  <div>
    <mt-header fixed title="安装扫码">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content install-container">
      <cus-field label="房号" tag="房号" class="disable"
                 :value="assets['Street Address 4']"></cus-field>
      <cus-field label="产品条形码" tag="产品条形码"
                 v-model="assets['Serial Number']"
                 v-valid.require>
        <div class="xs-icon icon-scan" @click="toScanFn"></div>
      </cus-field>
      <cus-field label="产品型号"  tag="产品型号"
                 :value="modelNo"
                 v-valid.require is-link></cus-field>

      <button-group>
        <mt-button class="single"
                   @click.native="saveFn">保存</mt-button>
      </button-group>
    </div>
  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  // use plugin
  Vue.use(vp);

  const NAMESPACE = 'detail';
  export default {
    name: NAMESPACE,
    // 初始化
    created() {
      let me = this;
      let param = me.$route.query;
      me.assets = KND.Util.parse(param.room);
      this.queryOrderLines({
        data: {
          'Order Header Id': me.assets['Original Order Id']
        },
        success: data => {
          this.panel = data.items.filter(item => item['KL Product Type LIC'] === 'Panel');
          console.log(this.panel);
        }
      });
    },
    data: () => {
      return {
        assets: '',
        panel: ''
      };
    },
    computed: {
      modelNo() {
        let model = this.panel[0];
        let modelNo = model && model['KL Product Model No Cal'];
        this.assets['Product Model No'] = modelNo;
        return modelNo;
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['queryOrderLines', 'installOrderAssets']),
      // 保存资产信息
      saveFn() {
        let me = this;
        tools.valid.call(me, () => {
          console.log(me.assets);
        });
      },
      /**
       * 调用app扫码
       */
      toScanFn() {
        console.log('scan');
      }
    },
    components: {buttonGroup, cusField}
  };
</script>

<style lang="scss">
  .install-container {
    .icon-scan {
      margin-left: 2px;
    }
  }
</style>
