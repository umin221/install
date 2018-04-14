<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content scanCode" :class="{'disable': !type}">
      <!--<mt-cell title="省市区"
               @click.native="showLovFn('KL_PROVINCE')"
               placeholder="请选择"
               is-link
               v-model="provinces"></mt-cell>
      <cus-field class="block"
                 label="详细地址"
                 v-model= 'detailAddress'
                 type="textarea"
                 placeholder="请输入详细地址"></cus-field>-->
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
               v-valid.require
               is-link></cus-field>
      <cus-field label="锁体型号" tag="锁体型号"
               placeholder="请输入"
                 v-model="lockBody"
               v-valid.require
               is-link></cus-field>
      <!--下拉菜单-->
      <mt-popup v-model="showBox" position="bottom">
        <menu-box @my-enter="enter"
                  @my-cancel="showBox = false"
                  @my-change="onValuesChange"
                  @my-change1="onValuesChange1"
                  :slots="slots"
                  :slots1="slots1"
                  :slots2="slots2"></menu-box>
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
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import menuBox from '../components/cus-menu';
  import api from '../api/api';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  Vue.use(vp);
  let isMunicipality = function(...args) {
    let me = this;
    let city = args.pop();
    let isMun = true;
    for (let i = 0;i < me.Municipality.length; i++) {
      if (city === me.Municipality[i]) {
        isMun = false;
      }
    }
    return isMun;
  };
  const NameSpace = 'scanCode';
  export default {
    name: NameSpace,
    created() {
      let param = this.$route.query;
      this.id = param.id;
      this.type = param.type;
      this.copy = param.copy;
      this.item = param.item;
      this.orderID = param.orderID;
      if (this.item) {
        if (this.copy) { // 复制把ID置空 新增
          this.item['Personal Address Id'] = '';
          this.item.Id = '';
        }
        this.KL_PROVINCE = this.item.Province;
        this.KL_CITY = this.item.City;
        this.SerialNumber = this.item['Serial Number'];
        this.provinces = this.item.Province + this.item.City;
        this.detailAddress = this.item['Street Address'];
        this.BuilingName = this.item['Street Address 2'];
        this.FloorName = this.item['Street Address 3'];
        this.RoomName = this.item['Street Address 4'];
        this.productId = this.item['Product Id'];
        this.productCode = this.item['Product Model No'];
        this.lockBody = this.item['KL Product Model No Lock Body'];
        this.panel = this.item['KL Product Model No Panel'];
      }
    },
    data: () => {
      return {
        id: '',
        type: true,
        copy: '', // 是否复制
        orderID: '',
        titleVal: '扫码录入',
        slots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots1: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots2: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        showBox: false,
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
      ...mapState('buildingInfo', ['Municipality']),
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
      ...mapActions('buildingInfo', ['reduceValFn', 'plusValFn', 'getLov']),
      scan() {
        let me = this;
        KND.Native.scanQRCode({
          success(data) {
            me.SerialNumber = data.resultStr;
          }
        });
      },
      showLovFn(type) {
        let me = this;
        me.slots[0].values = [];
        me.showBox = true;
        me.getLov({
          type: 'KL_PROVINCE',
          parent: '中国',
          success: data => {
            let datas = KND.Util.toArray(data.items) ;
            for (let i = 0;i < datas.length; i++) {
              me.slots[0].values.push(datas[i].Value);
            }
          }
        });
      },
      enter(values) {
        let me = this;
        let isMun = isMunicipality.call(this, values['KL_PROVINCE']);
        me.showBox = false;
        me.KL_PROVINCE = values['KL_PROVINCE'];
        me.KL_CITY = values['KL_CITY'];
        me.KL_TOWN = values['KL_TOWN'];
        if (isMun) {
          me.provinces = values['KL_PROVINCE'] + values['KL_CITY'] + values['KL_TOWN'];
        } else {
          me.provinces = values['KL_CITY'] + values['KL_TOWN'];
        }
      },
      onValuesChange(value) {
        let me = this;
        me.slots1[0].values = [];
        if (value[0]) {
          me.getLov({
            type: 'KL_CITY',
            parent: value[0],
            success: data => {
              let datas = KND.Util.toArray(data.items) ;
              for (let i = 0;i < datas.length; i++) {
                me.slots1[0].values.push(datas[i].Value);
              }
            }
          });
        }
      },
      onValuesChange1(value) {
        let me = this;
        me.slots2[0].values = [];
        if (value[0]) {
          me.getLov({
            type: 'KL_TOWN',
            parent: value[0],
            success: data => {
              let datas = KND.Util.toArray(data.items) ;
              for (let i = 0;i < datas.length; i++) {
                me.slots2[0].values.push(datas[i].Value);
              }
            }
          });
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
                      'Country': '中国',
                      'Province': self.KL_PROVINCE,
                      'City': self.KL_CITY,
                      'Street Address': self.detailAddress,
                      'Street Address 2': self.BuilingName,
                      'Street Address 3': self.FloorName,
                      'Street Address 4': self.RoomName,
                      'KL Building Number': '1',
                      'KL Floor Number': '1',
                      'KL Room Number': '1',
                      'Id': self.item['Personal Address Id'] || '00009',
                      'ListOfKL Install Order Asset': {
                        'KL Install Order Asset': {
                          'Original Order Id': self.orderID,
                          'KL Activity Id': self.id,
                          'Serial Number': self.SerialNumber,
                          'Product Id': self.productId,
                          /* 'KL Product Model No Panel': self.panel,
                          'KL Product Model No Lock Body': self.lockBody,*/
                          'Id': self.item.Id || '0000'
                        }
                      }
                    }
                  }
                }
              }
            },
            success: function(data) {
              if (!data.ERROR) {
                Toast('保存成功');
                KND.Util.back();
              }
            }
          });
        });
      }
    }
  };
</script>
