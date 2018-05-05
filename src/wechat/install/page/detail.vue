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
      <cus-field label="锁体型号"  tag="锁体型号"
                 :value="assets['KL Product Model No Lock Body']"
                 v-valid.require
                 @click.native="showLovFn('body')"
                 is-link></cus-field>

      <cus-field label="面板型号"  tag="面板型号"
                 :value="assets['KL Product Model No Panel']"
                 v-valid.require
                 @click.native="showLovFn('panel')"
                 is-link></cus-field>

      <button-group>
        <mt-button class="single"
                   @click.native="saveFn">保存</mt-button>
      </button-group>
    </div>

    <!--popup-->
    <mt-popup v-model="showBox" position="bottom">
      <menu-box @my-enter="enter"
                @my-cancel="showBox=false"
                vk="KL Product Model No Cal"
                :type="lovType"
                :slots="slots"></menu-box>
    </mt-popup>
  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import menuBox from 'public/components/cus-menu';

  const NAMESPACE = 'detail';
  export default {
    name: NAMESPACE,
    // 初始化
    created() {
      let me = this;
      let param = me.$route.query;
      me.assets = KND.Util.parse(param.room);
      // 获取订单行
      this.queryOrderLines({
        data: {
          'Order Header Id': me.assets['Original Order Id']
        },
        success: data => {
          if (data.items) {
            // 填充锁体面板，填充选择清单
            data.items.forEach(item => {
              if (item['KL Product Type LIC'] === 'Panel') me.panel.push(item);
              else if (item['KL Product Type LIC'] === 'Lock Body') me.body.push(item);
            });
            // 默认面板
            let panel = me.panel[0] || {};
            // 默认锁体
            let body = me.body[0] || {};
            me.assets['KL Product Model No Panel'] = panel['KL Product Model No Cal'];
            me.assets['KL Product Model No Lock Body'] = body['KL Product Model No Cal'];
            me.assets['Product Id'] = body['KL Final Product Id'];
          }
        }
      });
    },
    data: () => {
      return {
        assets: '', // 资产
        panel: [], // 面板
        body: [], // 锁体
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: ''
      };
    },
    methods: {
      ...mapActions(NAMESPACE, ['queryOrderLines', 'installOrderAssets']),
      // 保存资产信息
      saveFn() {
        let me = this;
        tools.valid.call(me, () => {
          let assets = me.assets;
          this.installOrderAssets({
            data: {
              'Id': assets['Id'],
              'Serial Number': assets['Serial Number'],
              'Product Id': assets['Product Id'],
              'KL Product Model No Lock Body': assets['KL Product Model No Lock Body'],
              'KL Product Model No Panel': assets['KL Product Model No Panel']
            }
          });
        });
      },
      /**
       * 调用app扫码
       */
      toScanFn() {
        let me = this;
        tools.cordova.scan(result => {
          me.assets['Serial Number'] = result.text;
        });
      },
      // 选择确认
      enter(values, type) {
        let obj = values[0];
        this.showBox = false;
        if (type === 'panel') {
          this.assets['Product Id'] = obj['KL Final Product Id'];
          this.assets['KL Product Model No Panel'] = obj['KL Product Model No Cal'];
        } else {
          this.assets['KL Product Model No Lock Body'] = obj['KL Product Model No Cal'];
        }
      },
      // 选择对话框
      showLovFn(type) {
        let me = this;
        me.lovType = type;
        me.showBox = true;
        me.slots[0].values = me[type];
      }
    },
    components: {buttonGroup, cusField, menuBox}
  };
</script>

<style lang="scss">
  .install-container {
    .icon-scan {
      margin-left: 2px;
    }
  }
</style>
