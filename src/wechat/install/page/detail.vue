<template>
  <div>
    <mt-header fixed title="安装扫码">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="wrapper">

      <div class="mint-content install-container">
        <cus-field label="房号" tag="房号" class="disable"
                   :value="assets['Street Address 4']"></cus-field>
        <cus-field label="产品条形码" tag="产品条形码"
                   :data-value="serial"
                   :attr="{ maxlength: 20 }"
                   v-model="assets['serial']"
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

        <div v-if="error.batch" class="error-tips">
          <div>错误：条码已绑定 <{{error.serial}}></div>
          <div>批次编号：{{error.batch}}</div>
          <div>安装地址：{{error.address}}</div>
        </div>

        <button-group>
          <mt-button class="single"
                     @click.native="saveFn">保存</mt-button>
        </button-group>
      </div>
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
      let room = KND.Util.parse(param.room);
      room.serial = room['serial'] || room['Serial Number'];
      me.assets = room;
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
            // product id，优先取 KL Final Product Id
            panel['KL Final Product Id'] = panel['KL Final Product Id'] || panel['Product Id'];
            me.assets['Product Id'] = panel['KL Final Product Id'];
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
        lovType: '',
        error: {
          address: '', // 已绑定条码详细位置
          batch: '' // 安装批次
        }
      };
    },
    computed: {
      serial() {
        let me = this;
        let assets = me.assets;
        let serial = assets['serial'];
        if (serial) {
          if (serial) assets['serial'] = serial.replace(/[\u4e00-\u9fa5]/g, '');
          // 查询条码绑定记录
          me.serialHasBind({
            serial: serial,
            success: data => {
              // 已存在绑定记录则不允许绑定，清空条码
              if (data.length) {
                let room = KND.Util.parse(data.shift().super);
                /**
                 * 当前房号资产查到记录，不属于重复情况
                 * 场景1，多个房号重复同一个条码；理论上不存在，后台也有做限制，不会存在多条一样的记录
                 * 场景2，不同安装人员，扫描同一个条码；只有第一个提交的安装人员能成功；在同一个批次中，可以直接查询出来，在不同批次中，需要总部专员查看
                 */
                if (room.Id === assets.Id) return serial;
                me.assets['serial'] = me.assets['serial'] = '';
                me.error.serial = serial;
                me.error.address = room['Province'] + room['City'] + room['Personal County'] + room['Street Address'] + room['Street Address 2'] + room['Street Address 3'] + room['Street Address 4'];
                me.error.batch = room['KL Activity Id'];
              } else {
                me.error = {};
              }
            }
          });
        }
        return serial;
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['queryOrderLines', 'installOrderAssets', 'serialHasBind']),
      // 保存资产信息
      saveFn() {
        let me = this;
        tools.valid.call(me, () => {
          let assets = me.assets;
          if (/[A-Za-z0-9]+$/.test(assets['serial'])) {
            this.installOrderAssets({
              data: {
                'Id': assets['Id'],
                'Serial Number': assets['serial'],
                'Product Id': assets['Product Id'],
                'KL Product Model No Lock Body': assets['KL Product Model No Lock Body'],
                'KL Product Model No Panel': assets['KL Product Model No Panel']
              },
              super: assets
            });
          } else {
            Toast('条码必须包含字母或数字');
          }
        });
      },
      /**
       * 调用app扫码
       */
      toScanFn() {
        let me = this;
        tools.cordova.scan(result => {
          me.assets['serial'] = result.text;
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

    .error-tips {
      font-size: 0.75rem;
      color: red;
      font-weight: bold;
      padding: 10px;
    }
  }
</style>
