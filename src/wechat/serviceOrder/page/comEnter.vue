<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="故障记录">
      <fallback slot="left"></fallback>
      <mt-button slot="right" @click.native="submit">提交</mt-button>
    </mt-header>

    <div class="mint-content addService">
      <div class="addform">
        <mt-field label="产品条形码" type="text" placeholder="输入或扫门锁条形码" @change="sarech" v-model="SerialNumber" class="textRight">
          <i class="xs-icon icon-scan" @click="scan"></i>
        </mt-field>
        <mt-cell class="mint-field" title="所在省市区" placeholder="请选择">{{Personal}}</mt-cell>
        <mt-field class="block"
                  label="详细地址"
                  v-model="Address"
                  placeholder="如设备过旧未贴条码,允许为空"
                  type="textarea" rows="2"></mt-field>
        <div class="floor-box">
          <input type="text" placeholder="楼栋名" v-model="building">
          <input type="text" placeholder="楼层" v-model="floor">
          <input type="text" placeholder="房号" v-model="room">
        </div>
        <!--<mt-cell class="require mint-field" title="产品型号" placeholder="请选择" @click.native="toSearchT('fault')" is-link>{{ProductModel}}</mt-cell>-->
        <mt-cell class="require mint-field"
                 title="面板型号"
                 placeholder="请选择"
                 @click.native="toLov('KL_LOCK_BODY_MODEL')" is-link>{{KL_LOCK_BODY_MODEL}}</mt-cell>
        <mt-cell class="require mint-field"
                 title="锁体型号"
                 placeholder="请选择"
                 @click.native="toLov('KL_LOCK_MODEL')" is-link>{{KL_LOCK_MODEL}}</mt-cell>
        <mt-cell class="mint-field require"
                 title="故障现象"
                 placeholder="请选择"
                 @click.native="toLov('SR_ROOTCAUSE')" is-link>{{SR_ROOTCAUSE}}</mt-cell>
        <mt-cell class="mint-field require"
                 :value="KL_SR_RESP"
                 @click.native="toLov('KL_SR_RESP')" title="责任划分" is-link></mt-cell>
        <mt-field class="block require"
                  label="解决方法"
                  v-model="repairDetails"
                  placeholder="详细描述或附加需求..."
                  type="textarea" rows="3"></mt-field>
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
  import { MessageBox } from 'mint-ui';

  let mapp = config.mapp;
  const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  let _upload = function(serverIds, id) {
    // 成功回调
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
      success: callback
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
      if (serviceType === 'child') {
        me.childId = serviceId;
      }
      if (status) {
        me.status = status;
      }
      if (serviceType === 'save') {
        me.getServiceR({
          Id: serviceId,
          callback: function(data) {
            me.SerialNumber = data['Serial Number'];
            me.SR_ROOTCAUSE = data['SR Rootcause'];
            me.AssetNumber = data['Asset Number'];
            me.KL_SR_RESP = data['KL Responsbility'];
            me.repairDetails = data['Repair Details'];
            me.KL_LOCK_BODY_MODEL = data['KL Lock Body Model'];
            me.KL_LOCK_MODEL = data['KL Lock Model'];
            me.status = data['Status'];
            if (me.SerialNumber) {
              me.sarech();
            }
          }
        });
      }
      me.getLov({
        type: 'KL_LOCK_MODEL',
        success: data => {
          mapp.option['KL_LOCK_MODEL'] = data.items;
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
        }
      });
      me.getLov({
        type: 'KL_SR_ATT_TYPE',
        parent: '',
        success: function(data) {
          console.log(data);
          let items = data.items;
          for (let i = 0; i < items.length;i++) {
            if (items[i].Name === 'Job Sheet') {
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
        Personal: '',    // 省市
        Address: '',       // 详细地址
        KL_SR_RESP: '', // 责任划分
        SR_ROOTCAUSE: '',           // 故障分类
        repairDetails: '', // 方法明细
        ProductId: '',    // 产品Id
        KL_LOCK_BODY_MODEL: '',
        KL_LOCK_MODEL: '',
        childId: '',
        building: '',
        floor: '',
        room: '',
        lovType: '',
        attach: { // 附件
          list: [],
          edit: true,
          title: '相关照片'
        }
      };
    },
    computed: {
      ...mapState(NameSpace, ['slots', 'slots1', 'ProductModel', 'mustForm']),
      ...mapState('detail', ['ServiceRequest'])
    },
    methods: {
      ...mapActions(NameSpace, ['getAsset', 'getLov1', 'valueChange1', 'upDateService', 'getServiceR']),
      ...mapActions('app', ['getLov', 'upload']),
      ...mapMutations(NameSpace, ['errorTips', 'setProductModel']),
      ...mapMutations('detail', ['setPartner']),
      sarech() {
        let me = this;
        delay(() => {
          if (me.SerialNumber) {
            me.getAsset({
              num: me.SerialNumber,
              callback: function(data) {
                console.log(data);
//              me.ProductModel = data['KL Product Model'];// 产品型号
                me.AssetNumber = data['Asset Number'];
                me.ProductId = data['Id'];  // 产品ID
                me.Personal = data['KL Personal Province'] + data['Personal City'];    // 省市
                me.Address = data['Personal Address'];// 详细地址
                me.building = data['KL Personal Address Building'];
                me.floor = data['KL Personal Address Floor'];
                me.room = data['KL Personal Address Room'];
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
//      toSearchT(type) {
//        this.$router.push({
//          name: 'searchTrans',
//          query: {
//            type: type
//          }
//        });
//      },
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
        for (let i = 0; i < me.mustForm.length; i++) {
          if (!me[me.mustForm[i].key]) {
            MessageBox({
              title: '提示',
              message: '请选择' + me.mustForm[i].name + '！'
            });
            return;
          }
        }
        let uploadAttach = id => {
          _upload.call(me, me.$refs.attach.getServerIds(), id);
        };
        let form = {
          'Id': me.childId || me.ServiceRequest['Id'],
          'Asset Number': me.AssetNumber, // 产品ID
          'SR Rootcause': me.SR_ROOTCAUSE,                   // 故障反馈
          'KL Responsibility': me.KL_SR_RESP,     // 责任划分
          'Repair Details': me.repairDetails, // 解决方法明细
          'KL Product Model': me.ProductModel,
          'srNum': me.ServiceRequest['SR Number'],
          'KL Lock Body Model': me['KL_LOCK_BODY_MODEL'],
          'KL Lock Model': me['KL_LOCK_MODEL'],
          callback: function(data) {
            let serviceId = me.$route.query.id;
            if (data) {
              uploadAttach(serviceId);
              this.$router.back();
            }
          }
        };
        if (!me.AssetNumber) {
          delete form['Asset Number'];
        }
        me.upDateService(form);
      }
    },
    components: {menuBox, MessageBox}
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
      background: white;
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
    }
    .textRight{
      .mint-cell-wrapper{
        .mint-cell-value{
          @include disFlex();
          input{
            height: 100%;
            text-align: right;
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
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 48px;

      input{
        width: 30%;
        line-height: 1.2rem;
      }
      input:focus{
        outline:0 !important
      }
    }
  }
</style>
