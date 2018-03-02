<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="创建维修服务">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content addService">
      <div class="addform">
        <mt-field label="联系电话" type="text" placeholder="请输入联系电话" v-model.trim="callPhone" class="textRight require"></mt-field>
        <mt-field label="报修联系人" type="text" placeholder="请输入联系人" v-model="ContactName" class="textRight require"></mt-field>
        <mt-cell class="require mint-field" title="联系人类型" placeholder="请选择" is-link>{{Type}}</mt-cell>
        <mt-cell class="require mint-field" @click.native="getLov('city')" title="省市" placeholder="请选择"  is-link></mt-cell>
        <mt-field class="block require" label="详细地址" placeholder="请输入详细地址..." type="textarea" rows="2"></mt-field>
        <mt-cell class="mint-field" title="故障现象" placeholder="请选择" is-link>{{subArea}}</mt-cell>
        <mt-cell class="mint-field" title="故障分级">{{Area}}</mt-cell>
        <mt-field class="block" label="客服说明" v-model="ProductFlag" placeholder="详细描述或附加需求..." type="textarea" rows="2"></mt-field>
        <mt-cell class="mint-field" title="客户预约时间"  placeholder="请选择" is-link>{{startDate}}</mt-cell>
        <div v-if="hideMore">
          <mt-field label="产品条形码" placeholder="客户如提供请输入" class="textRight" ></mt-field>
          <mt-field label="产品型号" placeholder="客户如提供请输入"  class="textRight"></mt-field>
          <mt-cell class="mint-field" title="移交日期"  placeholder="请选择" is-link></mt-cell>
        </div>
        <div class="addMore" v-if="!hideMore" @click="showMore">
          <i class="xs-icon icon-add"></i>
          <span>更多</span>
        </div>
      </div>
      <mt-popup v-if="showBox" v-model="showBox" position="bottom">
        <menuBox @my-enter="enter" @my-change="onValuesChange" @my-cancel="cancel" :slots="slots"></menuBox>
      </mt-popup>
      <ul class="search-list">
        <li v-for="(item, index) in search" :key="item.Id" @click="selectCaLL(item['Cellular Phone #'],item['Last Name'])">{{item['Cellular Phone #']}} {{item['Last Name']}}</li>
      </ul>
      <div class="submitButton">
        <mt-button size="normal" type="danger" @click="submit">提交</mt-button>
      </div>
    </div>
  </div>
</template>
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
            textarea{
              resize: none;
            }
          }
        }
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
  }
</style>
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
  export default {
    name: 'addService',
    created() {
    },
    data: () => {
      return {
        hideMore: false,
        ContactName: '',
        ContactId: '',
        callPhone: '',
        Type: '',
        Area: '',
        subArea: '',
        Priority: '',
        Description: '',
        ProductFlag: '',
        startDate: '',
        search: [],
        slots: [{
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        }],
        showBox: false
      };
    },
    methods: {
      showMore() {
        let me = this;
        me.hideMore = true;
      },
      submit() {
        let me = this;
        console.log(me.callPhone);
        api.get({
          key: 'getContact1',
          method: 'GET',
          success: function(data) {
            console.log(1);
            console.log(data);
            me.ContactId = data.items.Id;
//            api.get({
//              key: 'getAdd',
//              data: {
//                body: {
//                  SiebelMessage: {
//                    'MessageId': '',
//                    'MessageType': 'Integration Object',
//                    'IntObjectName': 'Base KL Service Request Interface BO',
//                    'IntObjectFormat': 'Siebel Hierarchical',
//                    'ListOfBase KL Service Request Interface BO': {
//                      'Service Request': {
//                        'Id': '1',
//                        'Contact Id': me.ContactId,
//                        'Contact Last Name': me.ContactName,
//                        'Area': '其它问题',
//                        'Sub-Area': '有一定影响力的社会人士',            // 故障现象2
//                        'Priority': '',            // 优先级
//                        'Description': '',        // 客服说明
//                        'Product Warranty Flag': '',  // 报修期限
//                        'CEM Planned Start Date': '', // 客户预约时间
//                        'KL Product Model': '',     // 产品型号
//                        'KL Cutoff Date': '',       // 移交日期
//                        'KL SN': ''                   // 产品条形码
//                      }
//                    }
//                  }
//                }
//              },
//              success: function(data) {
//                console.log(11);
//                console.log(data);
//              }
//            });
            console.log(me.ContactName);
            api.get({
              key: 'getaddContact',
              method: 'POST',
              data: {
                'body': {
                  'SiebelMessage': {
                    'MessageId': '222',
                    'MessageType': 'Integration Object',
                    'IntObjectName': 'Base KL Contact Interface BO',
                    'IntObjectFormat': 'Siebel Hierarchical',
                    'ListOfBase KL Contact Interface BO': {
                      'Contact': {
                        'Id': '222',
                        'M/F': '男',
                        'Type': '业主',
                        'Last Name': me.ContactName,
                        'Work Phone #': me.callPhone,
                        'Job Title': 'Job Title',
                        'KL Department': 'KL Department'
                      }
                    }
                  }
                }
              },
              success: function(data) {
                console.log(data);
              }
            });
          }
//          error: function(data) {
//            console.log(2);
//            console.log(data);
//            if (data) {
//              api.get({
//                url: 'http://192.168.166.8:9001/siebel-rest/v1.0/service/EAI Siebel Adapter/Upsert',
//                method: 'POST',
//                data: {
//                  'body': {
//                    'SiebelMessage': {
//                      'MessageId': '',
//                      'MessageType': 'Integration Object',
//                      'IntObjectName': 'Base KL Contact Interface BO',
//                      'IntObjectFormat': 'Siebel Hierarchical',
//                      'ListOfBase KL Contact Interface BO': {
//                        'Contact': {
//                          'Id': '17763756438',
//                          'M/F': '男',
//                          'Type': '业主',
//                          'Last Name': me.ContactName,
//                          'Work Phone #': '17763756438',
//                          'Job Title': 'Job Title',
//                          'KL Department': 'KL Department'
//                        }
//                      }
//                    }
//                  }
//                },
//                success: function(data) {
//                  console.log(data);
//                }
//              });
//            }
//          }
        });
      },
      getLov(values) {
        let me = this;
        me.showBox = true;
        api.get({
          url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="KL_PROVINCE" AND Parent="CN" &PageSize=100&StartRowNum=0',
          method: 'GET',
          success: function(data) {
            let datas = data.items;
            let Province = [];
            for (let i = 0; i < datas.length; i++) {
              Province.push(datas[i].Value);
            }
            me.slots[0].values = Province;
          }
        });
      },
      onValuesChange(values) {
        let me = this;
        if (values[0] !== undefined) {
          api.get({
            url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="KL_CITY" AND Parent Value="' + values[0] + '" &PageSize=100&StartRowNum=0',
            method: 'GET',
            success: function(data) {
              let datas = data.items;
              let Province = [];
              if (datas.constructor === Array) {
                for (let i = 0; i < datas.length; i++) {
                  Province.push(datas[i].Value);
                }
                me.slots[2].values = Province;
              } else {
                Province.push(datas.Value);
                me.slots[2].values = Province;
              }
            }
          });
        }
      },
      enter(values) {
        let me = this;
        me.showBox = false;
        console.log(values);
      },
      cancel() {
        let me = this;
        me.showBox = false;
      },
      async fetchData(val) {
        let me = this;
        if (me.callPhone) {
          api.get({
            url: 'http://192.168.166.8:9001/siebel-rest/v1.0/data/KL Contact Interface BO/Contact/?searchspec=[Cellular Phone %23] = ' + me.callPhone + '',
            method: 'GET',
            success: function(data) {
              console.log(data);
              me.search = data.items;
            }
          });
        } else {
          me.search = [];
        }
      },
      selectCaLL(callNur, name) {
        console.log(callNur);
        console.log(name);
        let me = this;
        if (callNur && name) {
          me.callPhone = callNur;
          me.ContactName = name;
          me.search = [];
        }
      }
    },
    watch: {
      callPhone() {
        delay(() => {
          this.fetchData();
        }, 300);
      }
    },
    components: {menuBox}

  };
</script>
