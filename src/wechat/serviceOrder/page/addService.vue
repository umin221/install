<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="创建维修服务">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content addService">
      <div class="addform">
        <mt-field label="联系电话" type="number" placeholder="请输入联系电话" v-model.trim="Contact_Phone" class="textRight require"></mt-field>
        <mt-field label="报修联系人" type="text" :attr="isCall" placeholder="请输入联系人" v-model="Contact_Name" class="textRight require"></mt-field>
        <mt-cell class="require mint-field"  @click.native="getLov('SR_TYPE')" title="联系人类型"  :value="SR_TYPE" placeholder="请选择" is-link></mt-cell>
        <mt-cell class="require mint-field" @click.native="getLov('KL_PROVINCE','CN')" title="省市" :value="KL_PROVINCE" placeholder="请选择"  is-link></mt-cell>
        <mt-field class="block require" label="详细地址" placeholder="请输入详细地址..." v-model="Address" type="textarea" rows="2"></mt-field>
        <mt-cell class="mint-field"  title="故障现象" :value="SR_AREA" @click.native="getLov('SR_AREA','')"  placeholder="请选择" is-link></mt-cell>
        <mt-cell class="mint-field" title="故障分级" :value="Priority"></mt-cell>
        <mt-field class="block" label="客服说明" v-model="ProductFlag" placeholder="详细描述或附加需求..." type="textarea" rows="2"></mt-field>
        <mt-cell class="mint-field" title="客户预约时间" @click.native="open('picker1')" :value="Start_Date"  placeholder="请选择" is-link></mt-cell>
        <div v-if="hideMore">
          <mt-field label="产品条形码" placeholder="客户如提供请输入" v-model="KL_SN" class="textRight" ></mt-field>
          <mt-field label="产品型号" placeholder="客户如提供请输入" v-model="KL_Product_Model"  class="textRight"></mt-field>
          <mt-cell class="mint-field" title="移交日期" :value="KL_Cutoff_Date"></mt-cell>
          <mt-cell class="mint-field" title="保修期限" :value="Product_Warranty_Flag" ></mt-cell>
        </div>
        <div class="addMore" v-if="!hideMore" @click="showMore">
          <i class="xs-icon icon-add"></i>
          <span>更多</span>
        </div>
      </div>
      <mt-popup v-if="showBox" v-model="showBox" position="bottom">
        <menuBox @my-enter="enter" @my-change="onValuesChange" @my-cancel="cancel" :type="lovType" :slots="slots"></menuBox>
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
        <li v-for="(item, index) in search" :key="item.Id" @click="selectCaLL(item['Cellular Phone #'],item['Last Name'])">{{item['Cellular Phone #']}} {{item['Last Name']}}</li>
      </ul>
      <div class="submitButton">
        <mt-button size="normal" type="danger" @click="submit">提交</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api/api';
  import menuBox from '../../../public/components/cus-menu.vue';
  const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  const NameSpace = 'addService';
  export default {
    name: NameSpace,
    created() {
    },
    computed: {
    },
    data: () => {
      return {
        hideMore: false,
        startDate: new Date(),
        value: '',
        pickerVisible: true,
        showBox: false,
        isCall: {},
        search: [],
        slots: [],
        lovType: '',
        Contact_Name: '',   // 报修联系人
        Contact_Phone: '',     // 联系电话
        Address: '',       // 详细地址
        PROVINCE: '',      // 省
        CITY: '',           // 市
        SR_TYPE: '',       //  联系人类型
        KL_PROVINCE: '',  // 省市
        SR_AREA: '',        // 故障现象
        Area: '',
        Priority: '',          // 故障等级
        ProductFlag: '',    // 客服说明
        Start_Date: null,        // 客户预约时间
        KL_SN: '',           // 条形码
        KL_Product_Model: '', // 产品类型
        KL_Cutoff_Date: '',  // 移交日期
        Product_Warranty_Flag: '' // 保修期限
      };
    },
    methods: {
      showMore() {
        let me = this;
        me.hideMore = true;
      },
      submit() {
        let me = this;
        api.get({
          url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/Service Request/Service Request',
          method: 'PUT',
          data: {
            'KL Contact Mobile Phone': me.Contact_Phone,
            'Contact Last Name': me.Contact_Name,
            'KL Personal Province': me.PROVINCE,
            'Personal City': me.CITY,
            'Personal Street Address': me.Address,
            'Area': me.Area,
            'Sub-Area': me.SR_AREA,
            'Priority': me.Priority,
            'Description': me.ProductFlag,
            'CEM Planned Start Date': me.Start_Date,
            'KL SN': me.KL_SN,
            'KL Product Model': me.KL_Product_Model,
            'KL Cutoff Date': me.KL_Cutoff_Date,
            'Product Warranty Flag': me.Product_Warranty_Flag,
            'Id': '1'
          },
          success: function(data) {
            console.log(data);
          }
        });
      },
      getLov(values, parent) {
        let me = this;
        let Province = [];
        me.showBox = true;
        me.lovType = values;
        if (values === 'KL_PROVINCE') {
          parent = ' AND Parent=' + '"' + parent + '"';
          me.slots = [
            {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
            {divider: true, content: '-', className: 'slot2'},
            {flex: 1, values: [], className: 'slot3', textAlign: 'center'}
          ];
        } else if (values === 'SR_TYPE') {
          parent = '';
          me.slots = [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}];
        } else if (values === 'SR_AREA') {
          parent = ' AND Parent is null';
          me.slots = [
            {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
            {divider: false, values: [], content: '-', className: 'slot2'},
            {flex: 1, values: [], className: 'slot3', textAlign: 'center'}
          ];
        }
        api.get({
          url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="' + values + '"' + parent + ' &PageSize=100&StartRowNum=0',
          method: 'GET',
          success: function(data) {
            let datas = data.items;
            for (let i = 0; i < datas.length; i++) {
              Province.push(datas[i].Value);
            }
            me.slots[0].values = Province;
          }
        });
      },
      onValuesChange(values, type) {
        if (type === 'KL_PROVINCE') {
          type = 'KL_CITY';
        }
        let me = this;
        if (values[0] !== undefined && values.length > 1) {
          api.get({
            url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="' + type + '" AND Parent Value="' + values[0] + '" &PageSize=100&StartRowNum=0',
            method: 'GET',
            success: function(data) {
              let datas = data.items;
              let Province = [];
              let High = [];
              if (datas.constructor === Array) {
                for (let i = 0; i < datas.length; i++) {
                  Province.push(datas[i].Value);
                  High.push(datas[i].High);
                }
                me.slots[2].values = Province;
                me.slots[1].values = High;
              } else {
                Province.push(datas.Value);
                High.push(datas.High);
                me.slots[2].values = Province;
                me.slots[1].values = High;
              }
            }
          });
        }
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
        if (type === 'SR_TYPE') {
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
      cancel() {
        let me = this;
        me.showBox = false;
      },
      async fetchData(val) {
        let me = this;
        if (me.Contact_Phone) {
          api.get({
            url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/KL Contact Interface BO/Contact/?searchspec=[Work Phone %23] = ' + me.Contact_Phone + '',
            method: 'GET',
            success: function(data) {
              me.search = KND.Util.isArray(data.items) ? data.items : KND.Util.toArray(data);
            },
            error: function(data) {
              me.search = data;
            }
          });
        } else {
          me.search = [];
        }
      },
      selectCaLL(callNur, name) {
        let me = this;
        if (callNur && name) {
          me.Contact_Phone = callNur;
          me.Contact_Name = name;
          me.search = [];
          me.isCall = {disabled: false};
        }
      }
    },
    watch: {
      Contact_Phone() {
        delay(() => {
          this.fetchData();
        }, 300);
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
    .mint-popup{
      width: 100%;
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
</style>
