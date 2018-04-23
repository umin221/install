<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content scanCode" :class="{'disable': !type}">
      <cus-field label="楼栋名" tag="楼栋名"
                placeholder="请输入"
                 v-model="BuilingName"
                v-valid.require></cus-field>
      <cus-field label="楼层" tag="楼层"
                placeholder="请输入"
                 v-model="FloorName"
                v-valid.require></cus-field>
      <cus-field label="房间号" tag="房间号"
                placeholder="请输入"
                 v-model="RoomName"
                v-valid.require></cus-field>
      <cus-field label="产品条形码" tag="产品条形码"
                placeholder="请输入"
                 v-model="SerialNumber"
                v-valid.require>
        <i class="xs-icon icon-scan" @click="scan"></i>
      </cus-field>
      <cus-field label="面板型号"  tag="面板型号"
               placeholder="请输入"
                 v-model="panel"
                 @click.native="showLovFn('panel')"
               v-valid.require
               is-link></cus-field>
      <cus-field label="锁体型号" tag="锁体型号"
               placeholder="请输入"
                 v-model="lockBody"
                 @click.native="showLovFn('lockBody')"
               v-valid.require
               is-link></cus-field>
      <!--下拉菜单-->
      <mt-popup v-model="showBox" position="bottom">
        <menu-box @my-enter="enterFn"
                  @my-cancel="showBox=false"
                  :vk="vk"
                  :type="lovType"
                  :slots="slots"></menu-box>
      </mt-popup>
      <button-group>
        <mt-button class="single"
                   v-show="type"
                   @click.native="scavenging">保存</mt-button>
      </button-group>
    </div>
  </div>
</template>
<style lang="scss">
  .scanCode {
    .mint-cell-value textarea{
      border: 1px solid #d9d9d9;
      border-radius: 0.1rem;
      margin-top: 0.5rem;
    }
    .button-cla {
      margin-top: 2.5rem;
      width: 100%;
      text-align: center;
    }
    .mint-button--normal {
      display: inline-block;
      padding: 0 12px;
      width: 5rem;
    }
    input {
      text-align: right!important;
    }
  }
</style>
<script type="application/javascript">
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import menuBox from 'public/components/cus-menu.vue';
  import api from '../api/api';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import {mapState} from 'vuex';

  Vue.use(vp);
  const NameSpace = 'scanCode';
  let mapp = config.mapp;

  export default {
    name: NameSpace,
    created() {
      var self = this;
      let param = this.$route.query;
      self.id = param.id;
      self.type = param.type;
      self.copy = param.copy;
      self.item = param.item;
      self.orderID = param.orderID;
      if (self.item) {
        if (self.copy) { // 复制把ID置空 新增
          self.item['Personal Address Id'] = '';
          self.item.Id = '';
        }
        self.KL_PROVINCE = self.item.Province;
        self.KL_CITY = self.item.City;
        self.SerialNumber = self.item['Serial Number'];
        self.provinces = self.item.Province + self.item.City;
        self.detailAddress = self.item['Street Address'];
        self.BuilingName = self.item['Street Address 2'];
        self.FloorName = self.item['Street Address 3'];
        self.RoomName = self.item['Street Address 4'];
        self.productId = self.item['Product Id'];
        self.productCode = self.item['Product Model No'];
        self.lockBody = self.item['KL Product Model No Lock Body'];
        self.panel = self.item['KL Product Model No Panel'];
      }
      console.dir(self.panelsList);
      console.dir(self.lockBodyList);
      mapp.option['panel'] = self.panelsList;
      mapp.option['lockBody'] = self.lockBodyList;

    },
    data: () => {
      return {
        id: '',
        type: true,
        copy: '', // 是否复制
        orderID: '',
        titleVal: '扫码录入',
        vk: 'KL Product Model No',
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: '',
        provinces: '',
        BuilingName: '',
        FloorName: '',
        RoomName: '',
        SerialNumber: '',
        KL_PROVINCE: '',
        KL_CITY: '',
        KL_TOWN: '',
        detailAddress: '',
        productId: '',
        productCode: '',
        panel: '',
        lockBody: '',
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    components: {buttonGroup, menuBox, cusField},
    computed: {
      ...mapState('detail', ['detailData', 'panelsList', 'lockBodyList']),
      // 表单只读
      read() {
        return !this.type;
      },
      // * 是否显示
      heartVisible() {
        return this.type ? '' : 'require';
      }
    },
    methods: {
      scan() {
        let me = this;
        KND.Native.scanQRCode({
          success(data) {
            me.SerialNumber = data.resultStr;
          }
        });
      },
      // 选择对话框
      showLovFn(type) {
        var self = this;
        self.lovType = type;
        self.showBox = true;
        console.dir('=========' + self.vk);
        self.slots[0].values = mapp.option[type];
      },
      // 选择确认
      enterFn(values, type) {
        console.log(values, type);
        let me = this;
        me.showBox = false;
        // 选择填充
        if (type === 'lockBody') {
          me.lockBody = values[0]['KL Product Model No'];
        } else {
          me.panel = values[0]['KL Product Model No'];
        }
      },
      scavenging() {
        console.dir('保存');
        var self = this;
        tools.valid.call(this, () => {
          api.get({
            key: 'setBuild',
            method: 'POST',
            data: {
              'body': {
                'ProcessName': 'KL Install Order Asset Room Upsert Process', // 详情ID
                'SiebelMessage': {
                  'MessageId': '',
                  'MessageType': 'Integration Object',
                  'IntObjectName': 'Base KL Install Order Asset Address',
                  'IntObjectFormat': 'Siebel Hierarchical',
                  'ListOfBase KL Install Order Asset Address': {
                    'Base KL Install Order Asset Address': {
                      'Country': self.detailData['KL Delivery Country'],
                      'County': self.detailData['KL Delivery County'] || '宝安区',
                      'Province': self.detailData['KL Delivery Province'],
                      'City': self.detailData['KL Delivery City'],
                      'Street Address': self.detailData['KL Delivery Address'],
                      'Street Address 2': self.BuilingName,
                      'Street Address 3': self.FloorName,
                      'Street Address 4': self.RoomName,
                      'KL Building Number': '1',
                      'KL Floor Number': '1',
                      'KL Room Number': '1',
                      'Id': self.item['Personal Address Id'] || '000099',
                      'ListOfKL Install Order Asset': {
                        'KL Install Order Asset': {
                          'Original Order Id': self.orderID,
                          'KL Activity Id': self.id,
                          // 'Serial Number': self.SerialNumber,
                          'Product Id': self.productId,
                          'KL Product Model No Panel': self.panel,
                          'KL Product Model No Lock Body': self.lockBody,
                          'Id': self.item.Id || '00001'
                        }
                      }
                    }
                  }
                }
              }
            },
            success: function(data) {
              if (!data.ERROR) {
                if (self.type) { // 新增成功 更新条形码
                  api.get({
                    key: 'getUPNumber',
                    method: 'PUT',
                    data: {
                      'Id': data.AssetId,
                      'Serial Number': self.SerialNumber
                    },
                    success: function(data) {
                      if (!data.ERROR) {
                        Toast('保存成功');
                        KND.Util.back();
                      }
                    }
                  });
                } else {
                  Toast('保存成功');
                  KND.Util.back();
                }
              }
            }
          });
        });
      }
    }
  };
</script>
