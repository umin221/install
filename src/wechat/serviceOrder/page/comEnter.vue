<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="故障记录">
      <fallback slot="left"></fallback>
      <mt-button slot="right"
                 v-if="isSubmit"
                 @click.native="submit">提交</mt-button>
    </mt-header>

    <div class="mint-content addService">
      <div class="addform">
        <mt-field label="产品条形码"
                  type="text"
                  placeholder="输入或扫门锁条形码"
                  @change="sarech"
                  v-model="SerialNumber"
                  :class="{readonly: !isSubmit}"
                  class="textRight">
          <i class="xs-icon icon-scan" v-if="isSubmit" @click="scan"></i>
        </mt-field>
        <!--<mt-cell class="mint-field" -->
                 <!--title="所在省市区" -->
                 <!--placeholder="请选择">{{Personal}}</mt-cell>-->
        <cus-field class=""
                 v-show="AssetNumber && SerialNumber"
                 label="所在省市区"
                   :value="Personal"
                  is-link></cus-field>

        <mt-field class="block border-none"
                  v-show="AssetNumber && SerialNumber"
                  :class="{readonly: !isSubmit}"
                  label="小区名称"
                  v-model="Address"
                  placeholder="如设备过旧未贴条码,允许为空"
                  type="textarea" rows="2"></mt-field>
        <div class="floor-box" v-show="AssetNumber && SerialNumber">
          <div>
            <input type="text" :class="{'readonly': !isSubmit}" placeholder="楼栋名" v-model="building">
            <input type="text" :class="{'readonly': !isSubmit}" placeholder="楼层" v-model="floor">
            <input type="text" :class="{'readonly': !isSubmit}" placeholder="房号" v-model="room">
          </div>
        </div>
        <!--<mt-cell class="require mint-field" title="产品型号" placeholder="请选择" @click.native="toSearchT('fault')" is-link>{{ProductModel}}</mt-cell>-->
        <!--<mt-cell class="require mint-field"-->
                 <!--title="面板型号"-->
                 <!--placeholder="请选择"-->
                 <!--@click.native="isSubmit&&toLov('KL_LOCK_MODEL')" is-link>{{KL_LOCK_MODEL}}</mt-cell>-->
        <cus-field class="require"
                   label="型号配置"
                   :value="KL_MODEL_CONFIG"
                   @click.native="isSubmit&&toLov('KL_MODEL_CONFIG')" is-link></cus-field>
        <cus-field class="require"
                   label="面板型号"
                   :value="KL_LOCK_MODEL"
                  @click.native="isSubmit&&toLov('KL_LOCK_MODEL')" is-link></cus-field>
        <!--<mt-cell class="require mint-field"-->
                 <!--title="锁体型号"-->
                 <!--placeholder="请选择"-->
                 <!--@click.native="isSubmit&&toLov('KL_LOCK_BODY_MODEL')" is-link>{{KL_LOCK_BODY_MODEL}}</mt-cell>-->
        <cus-field class="require"
                 label="锁体型号"
                   :value="KL_LOCK_BODY_MODEL"
                 @click.native="isSubmit&&toLov('KL_LOCK_BODY_MODEL')" is-link></cus-field>
        <!--<mt-cell class="mint-field require"-->
                 <!--title="故障现象"-->
                 <!--placeholder="请选择"-->
                 <!--@click.native="isSubmit&&toLov('SR_ROOTCAUSE')" is-link>{{SR_ROOTCAUSE}}</mt-cell>-->
        <cus-field class="require"
                 label="故障现象"
                   :value="SR_ROOTCAUSE"
                 @click.native="isSubmit&&toLov('SR_ROOTCAUSE')" is-link></cus-field>
        <!--<mt-cell class="mint-field require"-->
                 <!--:value="KL_SR_RESP"-->
                 <!--@click.native="isSubmit&&toLov('KL_SR_RESP')" title="责任划分" is-link></mt-cell>-->
        <cus-field class="require"
                 :value="KL_SR_RESP"
                 @click.native="isSubmit&&toLov('KL_SR_RESP')"
                   label="责任划分" is-link></cus-field>
        <mt-field class="block require"
                  :class="{readonly: !isSubmit}"
                  label="解决方法"
                  v-model="repairDetails"
                  placeholder="详细描述或附加需求..."
                  type="textarea" rows="3"></mt-field>
        <mt-field class="block"
                  :class="{readonly: !isSubmit}"
                  label="故障描述"
                  v-model="rootcauseDetails"
                  placeholder="故障描述填写"
                  type="textarea" rows="3"></mt-field>
        <!--<mt-checklist
          class="require"
          title="故障现象"
          v-model="valueList"
          :options="optionList">
        </mt-checklist>-->
        <div>
          <attach ioName="KL Service Request Attachment IO" ref="attach"
                  :attach="attach.list"
                  :edit="attach.edit"
                  :title="attach.title">
          </attach>
        </div>
      </div>
      <mt-popup v-if="showBox" v-model="showBox" position="bottom" style="width: 100%">
        <menuBox
          v-show="lovType === 'SR_ROOTCAUSE'"
          @my-enter="enter" @my-change="
          onValuesChange" @my-cancel="cancel"
          :type="lovType"
          :slots="slots">
        </menuBox>
        <menuBox
          v-show="lovType === 'KL_SR_RESP'"
          @my-enter="enter"
          @my-change="onValuesChange"
          @my-cancel="cancel"
          :type="lovType"
          :slots="slots1">
        </menuBox>
      </mt-popup>
      <mt-popup v-model="showBox1" position="bottom">
        <menu-box @my-enter="enter1" vk="Value"
                  @my-cancel="showBox1 = false"
                  :type="lovType"
                  :slots="slots2"></menu-box>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from '../../../public/components/cus-menu';
  import { Toast } from 'mint-ui';
  import cusField from '../../../public/components/cus-field';
  let phoneReg = new RegExp('^[A-Za-z0-9]+$');
  let mapp = config.mapp;
  const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  let _upload = function(serverIds, id) {
    let callback = data => {
      tools.success(data, {
        back: false,
        successTips: '提交成功'
      });
    };
    // 上传附件
    serverIds ? this.upload({
      data: {
        MediaId: serverIds,
        Id: id,
        IOName: 'KL Service Request Attachment IO',
        Comment: this.value
      },
      success: data => {
        console.log(data);
      }
    }) : callback(id);
  };
  const NameSpace = 'comEnter';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      let serviceId = me.$route.query.id;
      let serviceType = me.$route.query.type;
      let status = me.$route.query.statu;
      me.serviceType = serviceType;
//      KL Parent SR Complete Flag
//      KL Status LIC
      if (status) {
        me.status = status;
      }
      me.getServiceR({
        Id: serviceId,
        callback: function(data) {
          let datas = data['SiebelMessage']['Service Request'];
          me.SerialNumber = datas['Serial Number'];
          if (me.SerialNumber) {
            me.sarech();
          }
          if (serviceType === 'save') {
            me.SR_ROOTCAUSE = datas['SR Rootcause'];
            me.KL_SR_RESP = datas['KL Responsbility'];
            me.repairDetails = datas['Repair Details'];
            me.rootcauseDetails = datas['Description'];
            me.KL_LOCK_BODY_MODEL = datas['KL Lock Body Model'];
            me.KL_LOCK_MODEL = datas['KL Lock Model'];
            me.KL_MODEL_CONFIG = datas['KL Model Configuration'];
            me.status = datas['Status'];
            if (datas['KL Parent SR Complete Flag'] || datas['KL Status LIC'] === 'Completed') {
              me.isSubmit = false;
            }
            me.queryMedias({
              data: {
                'IOName': 'KL Service Request Attachment IO',
                'SearchSpec': {
                  'Service Request Attachment.Activity Id': datas.Id,
                  'Service Request Attachment.KL SR Att Type': 'LookupValue("KL_SR_ATT_TYPE", "Problem Record")'
                }
              },
              success: data => {
                let attach = KND.Util.toArray(data['SiebelMessage']['Service Request Attachment']);
                if (attach) {
                  me.attach.list = attach;
                }
              }
            });
          }
        }
      });
      me.getLov({
        type: 'KL_LOCK_MODEL',
        success: data => {
          mapp.option['KL_LOCK_MODEL'] = data.items;
        }
      });
      me.getLov({
        type: 'KL_MODEL_CONFIG',
        success: data => {
          mapp.option['KL_MODEL_CONFIG'] = data.items;
        }
      });
      me.getLov({
        type: 'KL_LOCK_BODY_MODEL',
        success: data => {
          mapp.option['KL_LOCK_BODY_MODEL'] = data.items;
        }
      });
      me.getLov({
        type: 'KL_SR_RESP',
        success: data => {
          mapp.option['KL_SR_RESP'] = data.items;
        }
      });
      me.getLov({
        type: 'SR_ROOTCAUSE',
        success: data => {
          mapp.option['SR_ROOTCAUSE'] = data.items;
          var items = data.items;
          for (var i = 0; i < items.length; i++) {
            var obj = {};
            obj.label = items[i].Value;
            obj.value = items[i].Value;
            me.optionList.push(obj);
          }
          console.dir('======');
          console.dir(me.optionList);
        }
      });
      me.getLov({
        type: 'KL_SR_ATT_TYPE',
        success: data => {
          console.log(data);
          let items = data.items;
          for (let i = 0; i < items.length;i++) {
            if (items[i].Name === 'Problem Record') {
              me.value = items[i].Value;
            }
          }
        }
      });
    },
    data: () => {
      return {
        showBox: false,
        showBox1: false,
        value: '故障问题记录',
        slots2: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        SerialNumber: '', // 条形码
        AssetNumber: '', // 产品编号
        ProductFlag: '', // 故障描述
        Province: '',
        City: '',
        County: '',
        Personal: '',    // 省市
        Address: '',       // 详细地址
        KL_SR_RESP: '', // 责任划分
        SR_ROOTCAUSE: '',  // 故障分类
        repairDetails: '', // 方法明细
        rootcauseDetails: '', // 故障描述
        ProductId: '',    // 产品Id
        KL_LOCK_BODY_MODEL: '',
        KL_LOCK_MODEL: '',
        KL_MODEL_CONFIG: '',
        valueList: [],
        optionList: [],
        srId: '',
        addressId: '',
        building: '',
        floor: '',
        room: '',
        lovType: '',
        isSubmit: true,
        attach: { // 附件
          list: [],
          edit: true,
          title: '故障照片'
        }
      };
    },
    computed: {
      ...mapState(NameSpace, ['slots', 'slots1', 'ProductModel', 'mustForm']),
      ...mapState('detail', ['ServiceRequest'])
    },
    methods: {
      ...mapActions(NameSpace, ['getAsset', 'getLov1', 'valueChange1', 'upDateService', 'getServiceR', 'upDateAddress']),
      ...mapActions('app', ['getLov', 'upload', 'queryMedias']),
      ...mapMutations(NameSpace, ['errorTips', 'setProductModel']),
      ...mapMutations('detail', ['setPartner']),
      sarech() {
        let me = this;
        delay(() => {
          if (me.SerialNumber) {
            if (!phoneReg.test(me.SerialNumber)) {
              me.SerialNumber = '';
              Toast('请输入正确的条形码');
              return;
            }
            me.getAsset({
              num: me.SerialNumber,
              callback: function(data) {
                console.log(data);
                if (data !== 'error') {
                  me.addressId = data['Personal Address Id'];
                  me.AssetNumber = data['Asset Number'];
                  me.ProductId = data['Id'];  // 产品ID
                  me.City = data['Personal City'];
                  me.Province = data['KL Personal Province'];
                  me.County = data['KL Personal Town'];
                  me.Personal = data['KL Personal Province'] + data['Personal City'] + data['KL Personal Town'];    // 省市
                  me.Address = data['Personal Address'];// 详细地址
                  me.building = data['KL Personal Address Building'];
                  me.floor = data['KL Personal Address Floor'];
                  me.room = data['KL Personal Address Room'];
                  me.KL_LOCK_BODY_MODEL = data['KL Lock Body Model'];
                  me.KL_LOCK_MODEL = data['KL Lock Model'];
                  // me.KL_MODEL_CONFIG = data['KL Model Configuration'];
                } else {
                  Toast('查无此资产');
                  me.SerialNumber = '';
                }
              }
            });
          }
        }, 500);
      },
      showArea(type) {
        let me = this;
        me.showBox = true;
        me.lovType = type;
        me.getLov1(type);
      },
      toLov(type) {
        let me = this;
        me.lovType = type;
        me.showBox1 = true;
        me.slots2[0].values = mapp.option[type];
      },
      enter1(value, type) {
        this.showBox1 = false;
        this[type] = value[0]['Value'];
      },
      enter(value, type) {
        this.showBox = false;
        if (type === 'SR_ROOTCAUSE') {
          this.rootcause = value[0];
        } else {
          this.Responsbility = value[0];
        }
      },
      onValuesChange(value, type) {
        if (type === 'SR_AREA') {
          if (value[0]) {
            this.valueChange1({type: 'SR_AREA', value: value[0]});
          }
        }
      },
      cancel(value) {
        this.showBox = false;
      },
      scan() {
        let me = this;
        KND.Native.scanQRCode({
          success(data) {
            me.SerialNumber = data.resultStr;
            me.sarech();
          }
        });
      },
      submit() {
        let me = this;
        let serviceId = me.$route.query.id;
        for (let i = 0; i < me.mustForm.length; i++) {
          if (!me[me.mustForm[i].key]) {
            Toast('请选择' + me.mustForm[i].name + '！');
            return;
          }
        }
        console.dir('===' + me.valueList);
        /* if (me.valueList.length < 1) {
          Toast('请选择故障现象!');
          return;
        } else {
          me.SR_ROOTCAUSE = me.valueList;
        }*/
        let uploadAttach = id => {
          _upload.call(me, me.$refs.attach.getServerIds(), id);
        };
        if (!me.AssetNumber || !me.SerialNumber) { // 产品条形码为空  Asset Number传空
          me.AssetNumber = '';
        }
        let form = {
          'Id': serviceId,
          'Asset Number': me.AssetNumber, // 产品ID
          'SR Rootcause': me.SR_ROOTCAUSE,                   // 故障反馈
          'KL Responsibility': me.KL_SR_RESP,     // 责任划分
          'Repair Details': me.repairDetails, // 解决方法明细
          'Description': me.rootcauseDetails, // 故障描述
          'KL Product Model': me.ProductModel,
          'srNum': me.ServiceRequest['SR Number'],
          'KL Lock Body Model': me['KL_LOCK_BODY_MODEL'],
          'KL Lock Model': me['KL_LOCK_MODEL'],
          'KL Model Configuration': me['KL_MODEL_CONFIG'],
          callback: function(data) {
            Toast('提交成功');
            KND.Session.set('popupVisible', 'popupVisible');
            me.$router.go(-1);
            setTimeout(function() {
              let name = me.$router.currentRoute.name;
              if (name === 'comEnter') {
                me.$router.go(-1);
              }
            }, 300);
          }
        };
        if (!me.AssetNumber || !me.SerialNumber) {
          // delete form['Asset Number'];
          me.upDateService(form);
        } else {
          let address = {
            'addrId': me.addressId,
            'Province': me.Province,
            'City': me.City,
            'County': me.County,
            'Street Address': me.Address,
            'Street Address 2': me.building,
            'Street Address 3': me.floor,
            'Street Address 4': me.room
          };
          me.upDateAddress({address, form});
        }
        uploadAttach(serviceId);
      }
    },
    components: {menuBox, Toast, cusField}
  };
</script>
<style lang="scss">
  @mixin disFlex (){
    display: flex !important;
    justify-content:center;
    align-items: center;
  }
  .addService{
    .addform{
      .block{
        .mint-cell-wrapper{
          display: block!important;
          .mint-cell-value{
            display: block!important;
            textarea{
              resize: none;
            }
          }
        }
      }
      .mint-checklist-title {
        font-size: 0.7rem !important;
      }
      .mint-checklist.require .mint-checklist-title:before {
        content: "*";
        color: red;
      }
    }
    .textRight{
      .mint-cell-wrapper{
        .mint-cell-value{
          @include disFlex();
          input{
            height: 100%;
            text-align: right;
            margin-right: 10px;
          }
        }
      }
    }
    .icon-right{
      position: absolute;
      right:0.5rem;
    }
    .submitButton,.addMore{
      @include disFlex();
    }
    .addMore{
      height: 2rem;
      color: $theme-color;
      font-size: 0.75rem;
      span{
        margin-left: 5px;
      }
    }
    .submitButton {
      height: 2.75rem;
      background: white;
      margin-top: 1rem;
      button {
        width: 60%;
        border-radius: 5px;
        background:$theme-color;
      }
    }
    .mint-field-core::-webkit-input-placeholder{
      color: #d4d4d4;
      font-weight: 100;
    }
    .mint-field{
      padding: 0 0.5rem;

      .mint-cell-wrapper{
        padding: 0;
        background-position: bottom;
        font-size: 0.75rem;

        .mint-cell-value{
          display: block;
          text-align: right;
        }
      }
    }
    .floor-box {
      padding: 0 0.5rem;
      div{
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 48px;
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 2%, transparent 3%);
        input{
          width: 30%;
          line-height: 1.2rem;
        }
        input:focus{
          outline:0 !important
        }
      }
    }
  }
  .border-none>.mint-cell-wrapper{
    background-image: none;
  }
  .readonly{
    readonly:expression(this.readOnly=false);
  }
  .fieldonly>.mint-cell-wrapper>.mint-cell-value>.mint-field-core{
    readonly:expression(this.readOnly=false);
  }
</style>
