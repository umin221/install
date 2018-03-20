<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="故障记录">
      <fallback slot="left"></fallback>
      <mt-button slot="right" @click.native="submit">提交</mt-button>
    </mt-header>

    <div class="mint-content addService">
      <div class="addform">
        <mt-field label="产品条形码" type="text" placeholder="输入或扫门锁条形码" @change="sarech" v-model="SerialNumber" class="textRight"></mt-field>
        <mt-cell class="mint-field" title="所在省市区" placeholder="请选择" is-link>{{Personal}}</mt-cell>
        <mt-field class="block" label="详细地址" v-model="Address" placeholder="如设备过旧未贴条码,允许为空" type="textarea" rows="2"></mt-field>
        <div class="floor-box">
          <input type="text" placeholder="楼栋名" v-model="building">
          <input type="text" placeholder="楼层" v-model="floor">
          <input type="text" placeholder="房号" v-model="room">
        </div>
        <mt-cell class="require mint-field" title="产品型号" placeholder="请选择" @click.native="toSearchT('fault')" is-link>{{ProductModel}}</mt-cell>
        <mt-cell class="mint-field require" title="故障现象" placeholder="请选择" @click.native="showArea('SR_ROOTCAUSE')" is-link>{{rootcause}}</mt-cell>
        <mt-cell class="mint-field require" :value="Responsbility" @click.native="showArea('KL_SR_RESP')" title="责任划分" is-link></mt-cell>
        <mt-field class="block require" label="解决方法" v-model="repairDetails" placeholder="详细描述或附加需求..." type="textarea" rows="3">
          <div style="line-height: 2rem"><i class="xs-icon icon-mic" style="float: right;"></i></div>
        </mt-field>
        <div>
          <div style="color: #777;font-size: 0.75rem;text-indent:0.75em;line-height: 40px">上传图片</div>
          <div style="text-indent:0.75em"><i class="xs-icon icon-attach"></i></div>
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
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from '../../../public/components/cus-menu';
  import { MessageBox } from 'mint-ui';

  const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  const NameSpace = 'comEnter';
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
        showBox: false,
        SerialNumber: '', // 条形码
        AssetNumber: '', // 产品编号
        ProductFlag: '', // 故障描述
        Personal: '',    // 省市
        Address: '',       // 详细地址
        Responsbility: '', // 责任划分
        rootcause: '',           // 故障分类
        repairDetails: '', // 方法明细
        ProductId: '',    // 产品Id
        building: '',
        floor: '',
        room: '',
        lovType: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['slots', 'slots1', 'ProductModel', 'mustForm']),
      ...mapState('detail', ['ServiceRequest'])
    },
    methods: {
      ...mapActions(NameSpace, ['getAsset', 'getLov1', 'valueChange1', 'upDateService']),
      ...mapMutations(NameSpace, ['errorTips']),
      ...mapMutations('detail', ['setPartner']),
      sarech() {
        let me = this;
        delay(() => {
          if (me.SerialNumber) {
            me.getAsset({
              num: me.SerialNumber,
              callback: function(data) {
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
      toSearchT(type) {
        this.$router.push({
          name: 'searchTrans',
          query: {
            type: type
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
        let form = {
          'Id': me.ServiceRequest['Id'],
          'Asset Number': me.AssetNumber, // 产品ID
          'SR Rootcause': me.rootcause,                   // 故障反馈
          'KL Responsibility': me.Responsbility,     // 责任划分
          'Repair Details': me.repairDetails, // 解决方法明细
          'KL Product Model': me.ProductModel,
          'srNum': me.ServiceRequest['SR Number'],
          callBack: function(data) {
            me.setPartner(data);
            me.$router.go(-1);
          }
        };
        console.log(form);
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
