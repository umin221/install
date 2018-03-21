<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="创建维修服务">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content addService">
      <div class="addform">
        <mt-field label="联系电话" type="number" placeholder="请输入联系电话" v-model.trim="Contact_Phone" class="textRight require"></mt-field>
        <mt-field label="报修联系人" type="text" :attr="isCall" placeholder="请输入联系人" v-model="Contact_Name" class="textRight require"></mt-field>
        <mt-cell class="require mint-field"  @click.native="getLov('CONTACT_TYPE')" title="联系人类型"  :value="CONTACT_TYPE" placeholder="请选择" is-link></mt-cell>
        <!--<mt-cell class="require mint-field margin-right" title="联系人类型"  :value="SR_TYPE"></mt-cell>-->
        <mt-cell class="require mint-field" @click.native="getLov('KL_PROVINCE','CN')" title="省市" :value="KL_PROVINCE" placeholder="请选择"  is-link></mt-cell>
        <mt-field class="block require" id="addressText" :attr="isEdit" label="详细地址" :placeholder="placeHold" v-model="Address" type="textarea" rows="2">
          <i class="xs-icon icon-edit" @click="editAddress" style="position: absolute;bottom: 1.8rem;right: 0.8rem;"></i>
        </mt-field>
        <mt-cell class="mint-field"  title="服务类型" :value="SR_TYPE" @click.native="getLov('SR_TYPE','')"  placeholder="请选择" is-link></mt-cell>
        <mt-cell class="mint-field"  title="故障现象" :value="SR_AREA" @click.native="getLov('SR_AREA','')"  placeholder="请选择" is-link></mt-cell>
        <mt-cell class="mint-field margin-right" title="故障分级" :value="Priority"></mt-cell>
        <mt-field class="block" label="客服说明" v-model="ProductFlag" placeholder="详细描述或附加需求..." type="textarea" rows="2"></mt-field>
        <mt-cell class="mint-field" title="客户预约时间" @click.native="open('picker1')" :value="Start_Date"  placeholder="请选择" is-link></mt-cell>
        <div v-if="hideMore">
          <mt-field label="产品条形码" placeholder="客户如提供请输入" @change="SnChange" v-model="KL_SN" class="textRight" ></mt-field>
          <mt-field label="产品型号" placeholder="客户如提供请输入" v-model="form.KL_Product_Model"  class="textRight"></mt-field>
          <mt-cell class="mint-field margin-right" title="移交日期" :value="form.KL_Cutoff_Date"></mt-cell>
          <mt-cell class="mint-field margin-right" title="保修期限" :value="form.Product_Warranty_Flag" ></mt-cell>
        </div>
        <div class="addMore" v-if="!hideMore" @click="showMore">
          <i class="xs-icon icon-add"></i>
          <span>更多</span>
        </div>
      </div>
      <mt-popup v-if="showBox" v-model="showBox" position="bottom">
        <menuBox v-show="lovType === 'SR_TYPE'" @my-enter="enter" @my-change="onValuesChange" @my-cancel="cancel" :type="lovType" :slots="srTypeSlots"></menuBox>
        <menuBox v-show="lovType === 'KL_PROVINCE'" @my-enter="enter" @my-change="onValuesChange" @my-cancel="cancel" :type="lovType" :slots="provinceSlots"></menuBox>
        <menuBox v-show="lovType === 'CONTACT_TYPE'" @my-enter="enter" @my-change="onValuesChange" @my-cancel="cancel" :type="lovType"  :slots="typeSlots"></menuBox>
        <menuBox v-show="lovType === 'SR_AREA'" @my-enter="enter" @my-change="onValuesChange" @my-cancel="cancel" :type="lovType" :slots="areaSlots"></menuBox>
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
        <li v-for="(item, index) in search" :key="item.Id" @click="selectCaLL(item)">{{item['Work Phone #']}} {{item['Last Name']}}</li>
      </ul>
      <div class="submitButton">
        <mt-button size="normal" type="danger" @click.native="submit">提交</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from '../../../public/components/cus-menu.vue';
//  import { MessageBox } from 'mint-ui';
  const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  const setAttrButt = (function() {
    return function(id) {
      let parent = document.getElementById(id);
      let child = parent.getElementsByTagName('textarea');
      child[0].removeAttribute('disabled');
    };
  })();
  const textCall = (function() {
    return function(callNum) {
      let phoneReg = new RegExp('^[1][3,4,5,7,8][0-9]{9}$');
      let workPhoneReg = new RegExp('^(([0\\+]\\d{2,3})?(0\\d{2,3}))(\\d{7,8})((\\d{3,}))?$');
      return (phoneReg.test(callNum) || phoneReg.test(workPhoneReg));
    };
  })();
  const NameSpace = 'addService';
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
        hideMore: false,
        startDate: new Date(),
        value: '12',
        pickerVisible: true,
        showBox: false,
        lovType: '',
        Contact_Phone: '',     // 联系电话
        Contact_Name: '',   // 报修联系人
        Contact_Id: '',     // 客户Id
        Address: '',       // 详细地址
        PROVINCE: '',      // 省
        CITY: '',           // 市
        CONTACT_TYPE: '业主',  //  联系人类型
        SR_TYPE: '',
        KL_PROVINCE: '',  // 省市
        SR_AREA: '',        // 故障现象
        Area: '',
        Priority: '',          // 故障等级
        ProductFlag: '',    // 客服说明
        Start_Date: null,        // 客户预约时间
        KL_SN: '',           // 条形码
        isCall: {},
        isEdit: {disabled: false},
        isClick: false,
        placeHold: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['search', 'provinceSlots', 'typeSlots', 'areaSlots', 'srTypeSlots', 'form', 'mustField']),
      ...mapState('index', ['loginMeg'])
    },
    methods: {
      ...mapActions(NameSpace, ['getSearch', 'getValue', 'valueChange', 'getSn', 'submitService']),
      ...mapMutations(NameSpace, ['removeSearch']),
      showMore() {
        let me = this;
        me.hideMore = true;
      },
      submit() {
        let me = this;
        for (let i = 0; i < me.mustField.length; i++) {
          if (!me[me.mustField[i].key]) {
            MessageBox({
              title: '提示',
              message: '请选择' + me.mustField[i].name + '！'
            });
            return;
          }
          if (me[me.mustField[i].name] === '联系人电话') {
            if (textCall(me.Contact_Phone)) {
              MessageBox({
                title: '提示',
                message: '联系电话格式错误请重新输入！'
              });
              me.Contact_Phone = '';
              return;
            }
          }
        }
        let key = (!me.isEdit.id && me.isClick) ? 'upDateContact' : 'submitService';
        console.log(me.loginMeg);
        let submitForm = {
          Contact_Id: me.Contact_Id,
          AddressId: me.AddressId,
          Contact_Phone: me.Contact_Phone,
          Contact_Name: me.Contact_Name,
          CONTACT_TYPE: me.CONTACT_TYPE,
          PROVINCE: me.PROVINCE,
          CITY: me.CITY,
          Address: me.Address,
          Area: me.Area,
          SR_AREA: me.SR_AREA,
          SR_TYPE: me.SR_TYPE,
          Priority: me.Priority,
          ProductFlag: me.ProductFlag,
          Start_Date: me.Start_Date,
          KL_SN: me.KL_SN,
          KL_Product_Model: me.form.KL_Product_Model,
          KL_Cutoff_Date: me.form.KL_Cutoff_Date,
          Product_Warranty_Flag: me.form.Product_Warranty_Flag,
          key: key,
          Owner: me.loginMeg['Login Name']
        };
        me.submitService(submitForm);
        me.$router.go(-1);
      },
      getLov(type) {
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
      selectCaLL(val) {
        let me = this;
        me.Contact_Id = val['Id'];
        me.Contact_Phone = val['Work Phone #'];
        me.AddressId = val['Primary Personal Address Id'];
        me.Contact_Name = val['Last Name'];
        me.Address = val['Primary Personal Street Address'];
        me.PROVINCE = val['KL Primary Personal Province'];
        me.CITY = val['Primary Personal City'];
        me.isCall = {disabled: false};
        me.isClick = true;
        me.KL_PROVINCE = me.PROVINCE + me.CITY;
        me.removeSearch();
      },
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange(value) {
        let me = this;
        me.Start_Date = value.format('MM/dd/yyyy hh:mm:ss');
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
      editAddress() {
        setAttrButt('addressText');
        this.isEdit = {};
        this.placeHold = '请输入详细地址...';
      },
      cancel() {
        let me = this;
        me.showBox = false;
      },
      SnChange() {
        let me = this;
        delay(() => {
          me.getSn(me.KL_SN);
        }, 500);
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
          if (this.isClick) {
            this.isClick = false;
          } else {
            this.fetchData();
          }
        }, 500);
      }
    },
    components: {menuBox}
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
          padding-right: 1rem;
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
