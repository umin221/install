<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="创建维修服务">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content addService">
      <div class="addform">
        <mt-field label="联系人电话"
                  type="tel"
                  placeholder="请输入联系电话"
                  v-model="Contact_Phone"
                  class="textRight require"></mt-field>
        <mt-field label="报修联系人"
                  type="text"
                  id="contactText"
                  :attr="isCall"
                  placeholder="请输入联系人"
                  v-model="Contact_Name"
                  class="textRight require"></mt-field>
        <!--<mt-cell class="mint-field require"-->
                 <!--@click.native="getLov('CONTACT_TYPE')"-->
                 <!--title="联系人类型"-->
                 <!--:value="CONTACT_TYPE"-->
                 <!--placeholder="请选择" is-link></mt-cell>-->

        <!--<mt-cell title="省市区"-->
                 <!--class="mint-field require"-->
                 <!--@click.native="showLovFn('KL_PROVINCE')"-->
                 <!--placeholder="请选择"-->
                 <!--is-link-->
                 <!--v-model="provinces"></mt-cell>-->
        <cus-field class="require"
                   @click.native="getLovType('CONTACT_TYPE')"
                   label="联系人类型"
                   :value="CONTACT_TYPE"
                   placeholder="请选择" is-link></cus-field>
        <cus-field label="省市区"
                 class="require"
                 @click.native="showLovFn('KL_PROVINCE')"
                 placeholder="请选择"
                 is-link
                 v-model="provinces"></cus-field>
        <mt-field class="block require"
                  id="addressText"
                  :attr="isEdit"
                  label="小区名称"
                  placeholder="请输入小区名称"
                  v-model="Address"
                  type="textarea" rows="2">
          <i class="xs-icon icon-edit" @click="editAddress" style="position: absolute;bottom: 1.8rem;right: 0.8rem;"></i>
        </mt-field>
        <div class="floor-box">
          <div>
            <input type="text"  placeholder="楼栋名" v-model="building">
            <input type="text"  placeholder="楼层" v-model="floor">
            <input type="text"  placeholder="房号" v-model="room">
          </div>
        </div>
        <!--<mt-cell class="mint-field require"-->
                 <!--title="服务类型"-->
                 <!--:value="SR_TYPE"-->
                 <!--@click.native="getLov('SR_TYPE','')"-->
                 <!--placeholder="请选择" is-link></mt-cell>-->
        <!--<mt-cell class="mint-field require"-->
                 <!--title="故障现象"-->
                 <!--:value="SR_AREA"-->
                 <!--@click.native="getLov('SR_AREA','')"-->
                 <!--placeholder="请选择" is-link></mt-cell>-->
        <!--<mt-cell class="mint-field margin-right"-->
                 <!--title="故障分级"-->
                 <!--:value="Priority"></mt-cell>-->
        <cus-field class="require"
                   label="服务类型"
                   :value="SR_TYPE"
                   @click.native="getLovType('SR_TYPE','')"
                   placeholder="请选择" is-link></cus-field>
        <cus-field class=" require"
                   label="故障现象"
                   :value="SR_AREA"
                   @click.native="getLovType('SR_AREA','')"
                   placeholder="请选择" is-link></cus-field>
        <mt-cell class="mint-field margin-right"
                  title="故障分级"
                  :value="Priority"></mt-cell>
        <!--<cus-field class=" margin-right"-->
                   <!--label="故障分级"-->
                   <!--:value="Priority"></cus-field>-->
        <mt-field class="block"
                  label="客服说明"
                  v-model="ProductFlag"
                  placeholder="详细描述或附加需求..."
                  type="textarea"
                  rows="2"></mt-field>
        <!--<mt-cell class="mint-field"-->
                 <!--title="客户预约时间"-->
                 <!--@click.native="open('picker1')"-->
                 <!--:value="StartDate"-->
                 <!--placeholder="请选择" is-link></mt-cell>-->
        <cus-field class=""
                 label="客户预约时间"
                 @click.native="open('picker1')"
                 :value="StartDate"
                 placeholder="请选择" is-link></cus-field>
        <div v-if="hideMore">
          <mt-field label="产品条形码"
                    placeholder="客户如提供请输入"
                    @change="SnChange"
                    v-model="KL_SN"
                    class="textRight" >
            <i class="xs-icon icon-scan" @click="toScan"></i>
          </mt-field>
          <!--<mt-field label="产品型号"
                    placeholder="客户如提供请输入"
                    v-model="form.KL_Product_Model"
                    class="textRight"></mt-field>-->
          <cus-field label="型号配置"
                     :value="form.KL_MODEL_CONFIG"
                     @click.native="toLov('KL_MODEL_CONFIG')" is-link></cus-field>
          <cus-field label="面板型号"
                     :value="form.KL_LOCK_MODEL"
                     @click.native="toLov('KL_LOCK_MODEL')" is-link></cus-field>
          <cus-field label="锁体型号"
                     :value="form.KL_LOCK_BODY_MODEL"
                     @click.native="toLov('KL_LOCK_BODY_MODEL')" is-link></cus-field>

          <mt-cell class="mint-field margin-right" title="移交日期"
                   :value="form.KL_Cutoff_Date"></mt-cell>
          <mt-cell class="mint-field margin-right" title="保修期限"
                   :value="form.Product_Warranty_Flag === 'Y'?'保内':form.Product_Warranty_Flag === 'N'?'保外': ''" ></mt-cell>
        </div>
        <div class="addMore" v-if="!hideMore" @click="showMore">
          <i class="xs-icon icon-add"></i>
          <span>更多</span>
        </div>
      </div>
      <mt-popup v-if="showBox" v-model="showBox" position="bottom">
        <menu-box v-show="lovType === 'SR_TYPE'"
                 @my-enter="enter"
                 @my-change="onValuesChange"
                 @my-cancel="cancel"
                 :type="lovType"
                 :slots="srTypeSlots"></menu-box>
        <menu-box v-show="lovType === 'CONTACT_TYPE'"
                 @my-enter="enter"
                 @my-change="onValuesChange"
                 @my-cancel="cancel"
                 :type="lovType"
                 :slots="typeSlots"></menu-box>
        <menu-box v-show="lovType === 'SR_AREA'"
                 @my-enter="enter"
                 @my-change="onValuesChange"
                 @my-cancel="cancel"
                 :type="lovType"
                 :slots="areaSlots"></menu-box>
      </mt-popup>

      <mt-popup v-model="showBox1" position="bottom">
        <menu-box1 @my-enter="enter1"
                  @my-cancel="showBox1 = false"
                  @my-change="onValuesChange1"
                  @my-change1="onValuesChange2"
                  :slots="slots"
                  :slots1="slots1"
                  :slots2="slots2"></menu-box1>
      </mt-popup>
      <mt-popup v-model="showBox3" position="bottom">
        <menu-box @my-enter="enter3" vk="Value"
                  @my-cancel="showBox3 = false"
                  :type="lovType"
                  :slots="slots3"></menu-box>
      </mt-popup>
      <mt-datetime-picker
        ref="picker1"
        v-model="pickerVisible"
        :startDate="startDate"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        hour-format="{value} 时"
        class="datetime"
        @confirm="handleChange">
      </mt-datetime-picker>
      <ul class="search-list">
        <li v-for="(item, index) in search" :key="item.Id" @click="selectCaLL(item)">{{item['Last Name']}}{{showPhone(item)}}</li>
      </ul>
      <!--<div class="submitButton">-->
        <!--<mt-button size="normal" type="danger" >提交</mt-button>-->
      <!--</div>-->
      <button-group>
        <mt-button class="single" @click.native="submit" >提交</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import { Toast } from 'mint-ui';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import menuBox1 from '../components/cus-menu';
  import menuBox from '../../../public/components/cus-menu';
  import cusField from '../../../public/components/cus-field';
  Vue.use(vp);
  let t = new Date().getTime() + 3600000;
  let today = new Date(t);
  let mapp = config.mapp;
  //  import { MessageBox } from 'mint-ui';
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
  const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  const setAttrButt = (function() {
    return function(id, type) {
      let parent = document.getElementById(id);
      let child = parent.getElementsByTagName(type);
      child[0].removeAttribute('disabled');
    };
  })();
  let textCall = function(callNum) {
    let me = this;
    // let phoneReg = new RegExp('^[1][3,4,5,7,8][0-9]{9}$');
    let phoneReg = new RegExp('^((\\+?[0-9]{1,4})|(\\(\\+86\\)))?(1)\\d{10}$');
    let workPhoneReg = new RegExp('^(([0\\+]\\d{2,3})?(0\\d{2,3}))(\\d{7,8})((\\d{3,}))?$');
    if (phoneReg.test(callNum)) {
      me.callPhone = callNum;
    }
    if (workPhoneReg.test(callNum)) {
      me.workPhone = callNum;
    }
    return (phoneReg.test(callNum) || workPhoneReg.test(callNum));
  };
  let phoneReg = new RegExp('^[A-Za-z0-9]+$');
  const NameSpace = 'addService';
  export default {
    name: NameSpace,
    created() {
      var me = this;
      me.setSn('');
      me.getLov({
        type: 'KL_MODEL_CONFIG',
        success: data => {
          mapp.option['KL_MODEL_CONFIG'] = data.items;
        }
      });
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
    },
    data: () => {
      return {
        hideMore: false,
        startDate: today,
        pickerVisible: today,
        showBox: false,
        showBox1: false,
        showBox3: false,
        lovType: '',
        slots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots1: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots2: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots3: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        Contact_Phone: '',     // 联系电话
        callPhone: '',
        workPhone: '',
        AssetNumber: '',
        KL_MODEL_CONFIG: '',
        KL_LOCK_BODY_MODEL: '',
        KL_LOCK_MODEL: '',
        Contact_Name: '',   // 报修联系人
        Contact_Id: '',     // 客户Id
        Address: '',       // 详细地址
        building: '',
        floor: '',
        room: '',
        KL_PROVINCE: '',      // 省
        KL_CITY: '',           // 市
        KL_TOWN: '',            // 区
        CONTACT_TYPE: '业主',  //  联系人类型
        SR_TYPE: '',
        SR_AREA: '',        // 故障现象
        Area: '',
        Priority: '',          // 故障等级
        ProductFlag: '',    // 客服说明
        Start_Date: null,        // 客户预约时间
        StartDate: '',
        KL_SN: '',           // 条形码
        arr: [],
        isCall: {},
        isEdit: {},
        isClick: false
      };
    },
    computed: {
      ...mapState(NameSpace, ['search', 'provinceSlots', 'typeSlots', 'areaSlots', 'srTypeSlots', 'form', 'mustField', 'Municipality']),
      ...mapState('index', ['loginMeg']),
      provinces() {
        let me = this;
        let isMun = isMunicipality.call(this, me.KL_PROVINCE);
        if (isMun) {
          return me.KL_PROVINCE + me.KL_CITY + me.KL_TOWN;
        } else {
          return me.KL_CITY + me.KL_TOWN;
        }
      }
    },
    methods: {
      ...mapActions('app', ['getLov']),
      ...mapActions(NameSpace, ['getSearch', 'getValue', 'valueChange', 'getSn', 'addContact', 'upDateContact', 'getLov1']),
      ...mapMutations(NameSpace, ['removeSearch', 'setSn', 'setType']),
      showMore() {
        let me = this;
        me.hideMore = true;
      },
      toLov(type) {
        let me = this;
        me.lovType = type;
        me.showBox3 = true;
        me.slots3[0].values = mapp.option[type];
      },
      showPhone(item) {
        let arrList = [];
        if (item['Cellular Phone #']) {
          arrList.push(item['Cellular Phone #']);
        }
        if (item['Work Phone #']) {
          arrList.push(item['Work Phone #']);
        }
        return arrList.join('/');
      },
      submit() {
        let me = this;
        for (let i = 0; i < me.mustField.length; i++) {
          if (!me[me.mustField[i].key]) {
            Toast('请选择' + me.mustField[i].name + '！');
            return;
          }
          if (me.mustField[i].name === '联系人电话') {
            if (me.isClick) {
              me.callPhone = me.arr[0];
              me.workPhone = me.arr[1];
            } else {
              if (!textCall.call(me, me.Contact_Phone)) {
                Toast('联系电话格式错误请重新输入');
                return;
              } else {
                textCall.call(me, me.Contact_Phone);
              }
            }
          }
        }
        if (me.SR_TYPE !== '咨询') {
          if (!me.KL_PROVINCE) {
            Toast('请输入省市区');
            return;
          }
          if (!me.Address) {
            Toast('请输入详细地址');
            return;
          }
        }
        let key = (me.isClick) ? 'upDateContact' : 'addContact';
        let submitForm = {
          Contact_Id: me.Contact_Id,
          AddressId: me.AddressId,
          workPhone: me.workPhone,
          callPhone: me.callPhone,
          Contact_Name: me.Contact_Name,
          CONTACT_TYPE: me.CONTACT_TYPE,
          KL_PROVINCE: me.KL_PROVINCE,      // 省
          KL_CITY: me.KL_CITY,           // 市
          KL_TOWN: me.KL_TOWN,            // 区
          Address: me.Address,
          building: me.building,
          floor: me.floor,
          room: me.room,
          Area: me.Area,
          SR_AREA: me.SR_AREA,
          SR_TYPE: me.SR_TYPE,
          Priority: me.Priority,
          ProductFlag: me.ProductFlag,
          Start_Date: me.Start_Date,
          KL_SN: me.KL_SN,
          AssetNumber: me.form.AssetNumber,
          KL_LOCK_BODY_MODEL: me.form.KL_LOCK_BODY_MODEL,
          KL_LOCK_MODEL: me.form.KL_LOCK_MODEL,
          KL_MODEL_CONFIG: me.form.KL_MODEL_CONFIG,
          KL_Product_Model: me.form.KL_Product_Model,
          KL_Cutoff_Date: me.form.Cutoff_Date,
          Product_Warranty_Flag: me.form.Product_Warranty_Flag,
          key: key,
          Owner: me.loginMeg['Login Name'],
          callback: function(data) {
            if (data) {
              KND.Session.set('reOrder', 'cusPending');
              me.$router.go(-1);
              Toast('提交成功！');
            }
          }
        };
        me[submitForm.key](submitForm);
      },
      getLovType(type) {
        let me = this;
        me.showBox = true;
        me.lovType = type;
        if (type === 'KL_PROVINCE') {
          me.getValue({type: type, parent: 'Parent= "CN"'});
        } else {
          me.getValue({type: type, parent: ''});
        }
      },
      onValuesChange(values, type) {
        let me = this;
        if (values[0] !== undefined && values.length > 1) {
          me.valueChange({type: type, value: values[0]});
        }
      },
      onValuesChange1(value) {
        let me = this;
        me.slots1[0].values = [];
        if (value[0]) {
          me.getLov1({
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
      onValuesChange2(value) {
        let me = this;
        me.slots2[0].values = [];
        if (value[0]) {
          me.getLov1({
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
      selectCaLL(val) {
        let me = this;
        me.arr = [];
        if (val['Cellular Phone #']) {
          me.arr.push(val['Cellular Phone #']);
        }
        if (val['Work Phone #']) {
          me.arr.push(val['Work Phone #']);
        }
        me.Contact_Id = val['Id'];
        me.Contact_Phone = me.arr.join('/');
        me.AddressId = val['Primary Personal Address Id'];
        me.Contact_Name = val['Last Name'];
        me.KL_PROVINCE = val['KL Primary Personal Province'];      // 省
        me.KL_CITY = val['Primary Personal City'];           // 市
        me.KL_TOWN = val['KL Primary Personal Town'];            // 区
        me.Address = val['Primary Personal Street Address'];
        me.building = val['KL Primary Personal Building'];
        me.floor = val['KL Primary Personal Floor'];
        me.room = val['KL Primary Personal Room'];
        me.isCall = {disabled: true};
        me.isEdit = {disabled: true};
        me.isClick = true;
        me.removeSearch();
      },
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange(value) {
        let me = this;
        me.StartDate = KND.Util.format(value, 'yyyy-MM-dd hh:mm:ss');
        me.Start_Date = value.format('MM/dd/yyyy hh:mm:ss');
      },
      showLovFn(type) {
        let me = this;
        me.slots[0].values = [];
        me.showBox1 = true;
        me.getLov1({
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
      enter(values, type) {
        let me = this;
        me.showBox = false;
        if (type === 'CONTACT_TYPE' || type === 'SR_TYPE') {
          me[type] = values[0];
        } else if (type === 'KL_PROVINCE') {
          me[type] = values[0] + values[1];
          me.PROVINCE = values[0];
          me.CITY = values[1];
        } else if (type === 'SR_AREA') {
          me.Area = values[0];
          me.Priority = values[1];
          me[type] = values[2];
        }
      },
      enter1(values) {
        let me = this;
        me.showBox1 = false;
        me.KL_PROVINCE = values['KL_PROVINCE'];
        me.KL_CITY = values['KL_CITY'];
        me.KL_TOWN = values['KL_TOWN'];
      },
      enter3(value, type) {
        let me = this;
        this.showBox3 = false;
        this[type] = value[0]['Value'];
        var obj = {
          type: type,
          value: value[0]['Value']
        };
        me.setType(obj);
      },
      editAddress() {
        setAttrButt('addressText', 'textarea');
        this.isEdit = {};
      },
      cancel() {
        let me = this;
        me.showBox = false;
      },
      SnChange() {
        let me = this;
        delay(() => {
          if (!phoneReg.test(me.KL_SN)) {
            me.KL_SN = '';
            Toast('请输入正确的条形码');
            return;
          }
          me.getSn(me.KL_SN);
        }, 300);
      },
      toScan() {
        let me = this;
        KND.Native.scanQRCode({
          success(data) {
            me.KL_SN = data.resultStr;
            me.SnChange();
          }
        });
      },
      async fetchData(val) {
        let me = this;
        if (me.Contact_Phone.length > 4) {
          me.getSearch(me.Contact_Phone);
        } else {
          me.removeSearch();
        }
      }
    },
    watch: {
      Contact_Phone() {
        delay(() => {
          if (!this.isCall.disabled && this.isClick) {
            this.isClick = false;
          }
          if (!this.isClick) {
            this.fetchData();
            setAttrButt('contactText', 'input');
            setAttrButt('addressText', 'textarea');
          } else {
            this.isCall = {};
            this.isEdit = {};
          }
          console.log(this.isClick);
        }, 500);
      }
    },
    components: {menuBox, menuBox1, vp, Toast, cusField}
  };
</script>
<style lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
  @mixin disFlex (){
    display: flex;
    justify-content:center;
    align-items: center;
  }
  .addService{
    .floor-box {
      padding: 0 0.5rem;
      background: #ebebeb;
      div{
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
    .addform{
      background: white;
      .block{
        .mint-cell-wrapper{
          display: block!important;
          .mint-cell-value{
            justify-content: flex-end;
            textarea{
              resize: none;
            }
          }
        }
      }
      .mint-field .mint-cell-wrapper .mint-cell-value{
        justify-content: flex-end;
      }
    }
    .search-list{
      z-index: 1;
      position: absolute;
      top: 1.8rem;
      background: white;
      width: 100%;
      list-style: none;
      box-shadow: 1px 1px 5px #ededed;
      -webkit-box-shadow: 1px 1px 5px #ededed;
    }
    .search-list>li{
      line-height: 1.5rem;
      text-align: center;
      color: #777;
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
      }
    }
    .datetime>.picker>.picker-items>.picker-slot:nth-child(5){
      display: none;
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
  input:disabled{
    background-color:#ffffff;
  }
  textarea:disabled{
    background-color:#ffffff;
  }
  .margin-right>.mint-cell-wrapper{
    .mint-cell-value>span{
      margin-right: 1rem;
    }
  }
</style>
